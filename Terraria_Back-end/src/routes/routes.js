/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      routes/routes.js                                                                                                               //
//                                                                                                                                     //
//      Définition des routes de base                                                                                                  //
//      Utilisables par les utilisateurs lambda                                                                                        //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation d'ExpressJS
const express = require("express");

// Importation des fonctions extérieures 
const { addUser }  = require("../controller/users");
const { getAvailableTipsList, getTip} = require('../controller/tips');
const { getUserToken, getGoogleToken, getDiscordToken } = require("../controller/token");
const { getTipComments } = require('../controller/comments');
const passport = require("passport");

// Definition des routes
const router = express.Router();

// Route pour le /register : Requiert les paramètres email, username, firstname, lastname, password, profilePicture
router.post("/api/register", addUser);

// Route pour le /login : Requiert les paramètres username et password
router.post("/api/login", getUserToken);

// Routes pour l'authentification via google
router.get('/auth/google', passport.authenticate('google',{scope : ['email','profile']}));
router.get( '/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/google/failure', session: false}), getGoogleToken);
router.get('/auth/google/failure', (req,res)=>{
    res.send('failed to log with google');
});

// Routes pour l'authentification via discord
router.get('/auth/discord', passport.authenticate('discord'));
router.get( '/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/auth/discord/failure', session: false}), getDiscordToken);
router.get('/auth/discord/failure', (req,res)=>{
    res.send('failed to log with discord');
});

// Route pour la consultation de la liste des astuces : /tips-list
router.get('/api/tips-list', getAvailableTipsList);

// Route pour consulter une astuce : /get-tip
router.get('/api/get-tip/:id', getTip);

// Route pour récupérer les commentaires liés à une astuce : /get-comments
router.get('/api/get-comments/:tipid', getTipComments);


module.exports = router;