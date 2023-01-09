/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      controller/tips.js                                                                                                             //
//                                                                                                                                     //
//      Définition des fonctions liées à la gestion d'astuces. Fonctionnalités implémentées :                                          //
//      Récupération de liste d'astuces (validées, non-validées, toutes), Récupération d'une astuce sélectionnée                       //
//      Ajout d'une astuce, Récupération de la liste des astuces d'un utilisateur, Modification d'une astuce pour un utilisateur,      //
//      Suppression d'une astuce (par un utilisateur ou un administrateur), Validation d'une astuce par un administrateur              //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation du modèle Tip
const { Tip } = require('../model/tip');

// Importation des fonctions de gestion de base de données 
const {Op, tips, selectQuery, insertQuery, updateQuery, deleteQuery, users } = require('../db/instance');
const { uploadFile, checkExtension, imageFileExtension } = require('./files');

// Fonction de récupération de la liste des astuces
// Utilisée pour la route /tips-list
const getAvailableTipsList = async(req, res) => {
    getTipsList(req, res, true);
}
const getWaitingTipsList = async(req, res) => {
    getTipsList(req, res, false);
}
const getTipsList = async(req, res, bIsAvailable) => {
    try{
        res.status(200).send(await selectQuery(tips, false, {where: {isAvailable: bIsAvailable}, include: {model: users, attributes:['username', 'profilePicture']}}));
    }
    catch(error){
        console.error('An error has occured in the getTipsList function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de récupération d'une simple astuce
// Utilisée pour la route /get-tip
const getTip = async(req, res) => {
    try { 
        // On récupère l'id de l'astuce envoyé en requête :
        const id_tip = req.params.id;
        // Puis on renvoie l'astuce correspondante à cet ID
        // Inutile de tester l'existence de l'astuce car cette requête est envoyé lorsque l'on clique sur une astuce
        // L'ID correspond donc forcément à une astuce existante
        res.status(200).send(await selectQuery(tips, true, {where: {id: id_tip}, include: {model: users, attributes:['username', 'profilePicture']}}));
    }
    catch(error) {
        console.error('An error has occured in the getTip function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction d'ajout d'astuce
// Utilisée pour la route /add-tip
const addTip = async(req, res) => {
    try{
        // On récupère de potentiels fichiers pour l'image de l'astuce
        let tipPicture = null;
        if (req.files)
            tipPicture = req.files.file;

        // On créé une nouvelle astuce
        // Chaque nouvelle astuce est initialement en attente    
        const tip = new Tip(
            req.body.title,
            req.body.subjectDescription,
            req.body.tipDescription,
            (tipPicture && checkExtension(tipPicture.name, imageFileExtension)) ? await uploadFile(tipPicture) : null,
            req.user.user.id,
            req.body.tags,
            false
        );

        if (!tip.isCorrect())
            res.status(401).send("KO : Please fill all the fields : title, subjectDescription, tipDescription");
        else{
            await insertQuery(tips, tip.getQueryData());
            res.status(200).send("OK : Tip has been added");
        }

    }
    catch(error){
        console.error('An error has occured in the addTip function : ', error);
        res.status(500).send('KO : An error has occured');
    } 
}

// Fonction de consultation de la liste des astuces pour un utilisateur
// Utilisée pour la route /my-tips (GET)
const getUserTips = async(req, res) => {
    try{
        // On récupère l'identifiant de l'utilisateur
        const userID = req.user.user.id;

        // On renvoie à présent la liste des astuces ayant cet identifiant de propriétaire
        res.status(200).send(await selectQuery(tips, false, {where: {userID: userID}}));
    }
    catch(error){
        console.error('An error has occured in the getUserTips function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de modification d'une astuce d'un utilisateur
// Utilisée pour la route /my-tips (PUT)
const updateUserTip = async(req, res) => {
    try{
        // On récupère l'identifiant de l'astuce
        const id = req.body.id;
        // Vérification de la présence du champs id
        if(!id){
            return res.status(500).send('KO : please fill the id field to specify which tips you want to modify');
        }
        // On récupère l'identifiant de l'utilisateur (question de sécurité)
        const userID = req.user.user.id;

        // On récupère les différentes valeurs que l'on doit modifier dans l'astuce
        const title = req.body.title;
        const subjectDescription = req.body.subjectDescription;
        const tipDescription = req.body.tipDescription;
        const tags = req.body.tags;

        // On récupère la nouvelle image potentielle de l'astuce
        let tipPicture = null;
        if (req.files)
            tipPicture = req.files.file;

        // On initialise les valeurs qui seront mises à jour suite à la requête
        let values = {};
        if (title) values.title = title;
        if (subjectDescription) values.subjectDescription = subjectDescription;
        if (tipDescription) values.tipDescription = tipDescription;
        if (tags) values.tags = tags;
        if(tipPicture && checkExtension(tipPicture.name, imageFileExtension)) values.tipPicture = await uploadFile(tipPicture);

        // Si ces valeurs ne sont pas vides, on réalise la mise à jour, sinon on renvoie une erreur
        if (JSON.stringify(values) !== '{}'){
            values.isAvailable = false;
            await updateQuery(tips, values, {id: id, userID: userID});
            res.status(200).send('OK : Tip successfully updated');
        }
        else 
            res.status(500).send('KO : Please fill at least one field');
    }
    catch(error) {
        console.error('An error has occured in the updateUserTip function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de suppression d'une astuce d'un utilisateur
// Utilisée pour la route /my-tips (DELETE)
const deleteUserTip = async(req, res) => {
    deleteTip(req, res, false);
}

// Fonction de suppresionn d'une astuce par un administrateur
// Utilisaée pour la route /manage-tips (DELETE)
const deleteAdminTip = async(req, res) => {
    deleteTip(req, res, true);
}

const deleteTip = async(req, res, bIsAdmin) => {
    try {
         // Vérification de la présence du champs id
         if(!req.params.id){
            return res.status(500).send('KO : please fill the id field to specify which tips you want to delete');
        }
        // Définition de la condition where
        let where = {};
        where.id = req.params.id;
        if (!bIsAdmin) where.userID = req.user.user.id;

        // Vérification de l'existance de l'astuce
        if(!(await selectQuery(tips, true, {where : where}))){
            if(bIsAdmin) return res.status(500).send('KO : This tip does not exist');
            else return res.status(500).send('KO : This tip does not exist or does not belong to you');
        }

        // On supprime à présent l'astuce
        await deleteQuery(tips, where);
        res.status(200).send('OK : Tip successfully deleted');
    }
    catch(error){
        console.error('An error has occured in the deleteTip function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de validation d'une astuce par un administrateur
// Utilisée pour la route /manage-tips (PUT)
const validateTip = async(req, res) => {
    try {
        // Récupération de l'identifiant d'astuce
        const id = req.body.id;

        // Vérification de la présence du champs id
        if(!id){
            return res.status(500).send('KO : please fill the id field to specify which tips you want to validate');
        }

        // Vérification de l'existance de l'astuce
        if(!(await selectQuery(tips, true, {where: {id: id, isAvailable: false}}))){
            return res.status(500).send('KO : This tip does not exist or is already validated');
        }

        // Mise à jour de l'astuce (isAvailable devient true);
        await updateQuery(tips, {isAvailable: true}, {id: id});
        res.status(200).send('OK : Tip is successfully validated');
    }
    catch(error){
        console.error('An error has occured in the validateTip function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

module.exports = {getAvailableTipsList, getWaitingTipsList, getTip, addTip, getUserTips, updateUserTip, deleteUserTip, validateTip, deleteAdminTip};