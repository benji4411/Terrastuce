/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      controller/token.js                                                                                                            //
//                                                                                                                                     //
//      Définition des fonctions liées aux token d'authentification. Fonctionnalités implémentées                                      //
//      Génération du token, Récupération du token, Vérification du token                                                              //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de JSON Web Token
const jwt = require("jsonwebtoken");

// Importation des fonctions extérieures
const {Op, users, selectQuery} = require("../db/instance");
const { User, UserType } = require("../model/user");
const { hashPassword } = require("./password");

// Clé secrète permettant de chiffrer et déchiffrer le token (doit être normalement sécurisée et non accessible dans le code)
const accessTokenSecret = "4232154665OAZKI";

// Fonction de récupération du token d'authentification
// Utilisée pour la route /login
const getUserToken = async(req, res) => {
    try {
        const username = req.body.username;
        const password = await hashPassword(req.body.password);

        // On recherche l'utilisateur avec les informations reçues concernant l'username et le mot de passe
        if (!username || !password) res.status(500).send("KO : Please only fill the required fields username and password ");
        else {
            let user = await selectQuery(users, true, {where: {[Op.and]: [{username: username}, {password: password}, {type: UserType.INTERN}] }});
            // Si l'utilisateur n'existe pas, on renvoie une erreur
            if (!user) res.status(500).send("KO : Bad credential/incorect user");
            // Si l'utilisateur est banni, on renvoie une erreur
            else if(user.isBanned) res.status(500).send('KO : This user is banned')
            // Sinon, on renvoie le token de connexion pour cet utilisateur
            else res.status(200).send({ token: generateAccesToken(user), isAdmin: user.isAdmin, userID: user.id, authType: user.type });
        }
    } catch (error) {
        // Si une erreur quelconque est survenue
        console.error("An error has occured in the getToken function : ", error);
        res.status(500).send("KO : An error has occured");
    }
};

// Fonction de récupération du token d'authentification pour un utilisateur Google
// Utilisée pour la route /auth/google/callback
const getGoogleToken = async(req, res) => {
    // On récupère l'utilisateur google dans la base de données
    let user = await selectQuery(users, true, {where: {[Op.and]: [{password: await hashPassword(req.user.id)}, {type: UserType.GOOGLE}] }});
    // Si l'utilisateur est banni, on renvoie une erreur
    if(user.isBanned) res.status(500).send('KO : This user is banned');
    // Sinon, on renvoie le token de connexion pour cet utilisateur
    else {
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({token: generateAccesToken(user), isAdmin: user.isAdmin, userID: user.id, authType: user.type }));
        res.status(200).send(responseHTML);
    }
}

// Fonction de récupération du token d'authentification pour un utilisateur Discord
// Utilisée pour la route /auth/discord/callback
const getDiscordToken = async(req, res) => {
    // On récupère l'utilisateur discord dans la base de données
    let user = await selectQuery(users, true, {where:{[Op.and]: [{password: await hashPassword(req.user.id)}, {type: UserType.DISCORD}] }});
    // Si l'utilisateur est banni, on renvoie une erreur
    if(user.isBanned) res.status(500).send('KO : This user is banned');
    // Sinon, on renvoie le token de connexion pour cet utilisateur
    else {
        var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
        responseHTML = responseHTML.replace('%value%', JSON.stringify({token: generateAccesToken(user), isAdmin: user.isAdmin, userID: user.id, authType: user.type}));
        res.status(200).send(responseHTML);
    }
}

// Fonction de vérification du token d'authentification
// Utilisé comme middleware pour toutes les secure_routes et admin_routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; //Récupère l'autorisation sous la forme : Basic <token>
    const token = authHeader && authHeader.split(" ")[1]; // token = false si authHeader est vide sinon récupère la deuxième partie de authHeader correspondant au token

    if (!token) return res.status(500).send("KO : Empty authHeader");

    jwt.verify(token, accessTokenSecret, (error, user) => {
        if (error) {
            console.error("An error has occured in the JSON Web Token verify function : ", error);
            return res.status(500).send("KO : Invalid token");
        } //Vérifie si le token est valide
        req.user = user; //Ajoute les informations de l'utilisateur dans le request
        next();
    });
}

// Fonction qui génère un nouveau token d'authentification
// Le paramètre user correspond à l'objet à chiffrer afin de creer le token
// La fonction renvoie le token
function generateAccesToken(user) {
    try {
        return jwt.sign({ user }, accessTokenSecret, { expiresIn: "1800s" });
    } catch (error) {
        console.error("An error has occured in the generateAccessToken function : ", error);
    }
}

function isAdmin(req,res,next){
    if (!req.user.user.isAdmin) {
        return res.status(500).send("KO : You are not an administrator");
    }
    next();
}

module.exports = {authenticateToken, getUserToken, getGoogleToken, getDiscordToken, isAdmin};