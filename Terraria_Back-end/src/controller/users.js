/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      controller/users.js                                                                                                             //
//                                                                                                                                     //
//      Définition des fonctions liées à la gestion d'utilisateurs. Fonctionnalités implémentées :                                     //
//      Création d'utilisateur, Récupération de profil, Modification de profil,                                                        //
//      Récupération de liste d'utilisateur, Bannissement d'utilisateur, Promotion d'utilisateur                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation du modèle User
const { User, UserType } = require("../model/user");

// Importation des fonctions extérieures
const { Op, users, selectQuery, insertQuery, updateQuery, deleteQuery} = require("../db/instance");
const { uploadFile, checkExtension, imageFileExtension } = require('./files');
const { hashPassword } = require("./password");

// Fonction d'ajout d'un utilisateur interne au site
// Utilisée pour la route /register
const addUser = async(req, res) => {
    try {
        // On créé un nouvel utilisateur à partir des champs email, password, username, firstname, lastname, profilePicture dans le body de la requête REST
        // les champs isBanned et isAdmin sont mis à false
        // Le champ profilePicture est une image par défaut définie dans le serveur
        const user = new User(req.body.email, await hashPassword(req.body.password), req.body.username, req.body.firstname, req.body.lastname, UserType.INTERN, req.body.profilePicture, false, false);
        // Si les champs ne sont pas corrects, c'est-à-dire que certains sont vides (ou null), un message d'erreur est renvoyé
        if (!user.isCorrect())
            res.status(401).send("KO : Please fill all the fields : email, username, firstname, lastname, password");
        // Si l'utilisateur existe déjà, un autre message d'erreur est renvoyé
        else if (await selectQuery(users, true, {where: {[Op.and]: [{[Op.or] : [{username: user.username},{email: user.email}]},{type: UserType.INTERN}]}}))
            res.status(401).send("KO : User already exists");
        // Si tout va bien jusqu'ici, on rajoute l'utilisateur dans la base de données, et un message de confirmation est renvoyé
        else {
            await insertQuery(users, user.getQueryData());
            res.status(200).send("OK : User has been added");
        }
    } catch (error) {
        // Si une erreur quelconque est survenue
        console.error("An error has occured in the addUser function : ", error);
        res.status(500).send("KO : An error has occured");
    }
};

// Fonction de récupération du profil d'un utilisateur
// Utilisée pour la route /profile (GET)
const getUserProfile = async(req, res) => {
    try {
        // On stocke les données de la requêtes afin d'aller le code pour la suite
        const id = req.user.user.id;
        
        const user = await selectQuery(users, true, {attributes: ['firstname', 'lastname', 'username', 'email', 'profilePicture'], where: {id: id}});
        res.status(200).send(user);
    }
    catch(error) {
        console.error('An error has occured in the getUserProfile function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Foncion de modification du profil d'un utilisateur
// Utilisée pour la route /profile (PUT)
const updateUserProfile = async(req, res) => {
    try {
        // On enregistre l'id de l'utilisateur
        const id = req.user.user.id;

        // On enregistre les différentes valeurs email...
        // Ces valeurs pourront potentiellement être nulles
        const email = req.body.email;
        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        // On enregistre également le type d'authentification de l'utilisateur
        const authType = req.body.authType;

        // Récupération des fichiers à envoyer (image de profil)
        let profilePicture = null;
        if (req.files)
            profilePicture = req.files.file;

        // On définit les valeurs que l'on modifiera
        let values = {};
        if (email) {
            if (await selectQuery(users, true, {where: {email: email, type: authType, id:{ [Op.ne] : id}}}))
                return res.status(500).send('KO : This email is already registered');
            values.email = email;
        }
        if (username) {
            if (await selectQuery(users, true, {where: {username: username, type: authType, id:{ [Op.ne] : id}}}))
                return res.status(500).send('KO : This username is already taken');
            values.username = username
        }
        if (firstname) values.firstname = firstname;
        if (lastname) values.lastname = lastname;
        if (profilePicture && checkExtension(profilePicture.name, imageFileExtension)) {
            values.profilePicture = await uploadFile(profilePicture);
        }

        // Si ces valeurs ne sont pas vides, on réalise la mise à jour, sinon on renvoie une erreur
        if (Object.keys(values).length !== 0) {
            await updateQuery(users, values, {id: id});
            res.status(200).send('OK : User successfully updated');
        }
        else{
            res.status(500).send('KO : Please fill at least one field');
        }
    }
    catch(error) {
        console.error('An error has occured in the updateUserProfile function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de modification du mot de passe de l'utilisateur
// Utilisée pour la route /edit-password (PUT)
const editPassword = async(req, res) => {
    try{
        // On enregistre l'id de l'utilisateur
        const id = req.user.user.id;

        // On récupère les différents paramètres (ancien mot de passe, nouveau mot de passe)
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        // On vérifie que les deux paramètres sont bien remplis
        if (!(oldPassword && newPassword))
            return res.status(500).send('KO : Please fill all required fields : oldPassword AND newPassword');

        // On vérifie l'existance de l'utilisateur avec le mot de passe donné 
        if (!await selectQuery(users, true, {where:{id : id, password: await hashPassword(oldPassword)}})) 
            return res.status(500).send('KO : Wrong password');
        
        // On enregistre le nouveau mot de passe
        await updateQuery(users, {password: await hashPassword(newPassword)}, {id: id});
        return res.status(200).send('OK : Password successfully edited');
    }
    catch(error) {
        console.error('An error has occured in the editPassword function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de récupération de la liste des utilisateurs
// Utilisée dans le route /user-list (GET)
const getAllUsers = async(req, res) => {
    try{
        // On récupère la liste de tous les utilisateurs, que l'on renvoie aussitôt
        // On ne récupère pas l'utilisateur courant et le superadministrateur
        // Cela servira pour promouvoir / dégrader :
        // -> On ne veut pas qu'un administrateur se dégrade lui-même
        // -> Le super-administrateur doit pouvoir dégrader un administrateur tyrannique qui causerait le chaos sur le site Web
        const userList = await selectQuery(users, false, {where: {[Op.and] : [{id : {[Op.ne] : req.user.user.id }}, {id : {[Op.ne] : 1}}]}});
        res.status(200).send(userList);
    }
    catch(error){
        console.error('An error has occured in the getAllUsers function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de bannissement d'un utilisateur (permet également de débannir un utilisateur)
// Utilisée dans la route /ban-user (PUT)
const toggleBanUser = async(req, res) => {
    try{
        // On récupère l'identifiant de l'utilisateur à bannir/débannir
        const id = req.body.id;

        // Vérification de la présence du champs id
        if(!req.body.id){
            return res.status(500).send('KO : Please fill the id field to specify which user you want to ban/unban');
        }

        // Vérification de l'existance de l'utilisateur
        if(!(await selectQuery(users, true, {where : {id: id}}))){
            return res.status(500).send('KO : This user does not exist');
        }

        // On récupère la valeur de l'état du compte (banni / actif)
        const isBanned = (await selectQuery(users, true, {attributes: ['isBanned'], where: {id: id}})).dataValues.isBanned;

        // On met à jour la valeur de l'état du compte (l'inverse de la valeur actuelle)
        await updateQuery(users, {isBanned: !isBanned}, {id: id});
        res.status(200).send(`OK : User successfully ${(isBanned) ? 'unbanned' : 'banned'}`)
    }
    catch(error){
        console.error('An error has occured in the banUser function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de promotion d'un utilisateur
// Utilisée dans la route /promote-user (PUT)
const toggleAdminUser = async(req, res) => {
    try{
        // On récupère l'identifiant de l'utilisateur à promouvoir
        const id = req.body.id;

        // Vérification de la présence du champs id
        if(!id){
            return res.status(500).send('KO : please fill the id field to specify which user you want to promote');
        }

        // Vérification de l'existance de l'utilisateur
        if(!(await selectQuery(users, true, {where : {id: id}}))){
            return res.status(500).send('KO : This user does not exist');
        }

         // On récupère la valeur de l'état du compte (utilisateur / administrateur)
         const isAdmin = (await selectQuery(users, true, {attributes: ['isAdmin'], where: {id: id}})).dataValues.isAdmin;

        // On réalise la promotion de l'utilisateur
        await updateQuery(users, {isAdmin : !isAdmin}, {id: id});
        res.status(200).send(`OK : User successfully ${(isAdmin) ? 'demoted' : 'promoted'}`);
    }
    catch(error){
        console.error('An error has occured in the promoteUser function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

module.exports = {addUser, getUserProfile, updateUserProfile, editPassword, getAllUsers, toggleBanUser, toggleAdminUser};