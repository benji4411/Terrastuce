/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      routes/secure_routes.js                                                                                                        //
//                                                                                                                                     //
//      Définition des routes sécurisées                                                                                               //
//      Utilisables par les utilisateurs authentifiés                                                                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation d'ExpressJS
const express = require("express");

//Importation des fonctions extérieures
const { authenticateToken } = require("../controller/token");
const { getUserProfile, updateUserProfile, editPassword } = require('../controller/users');
const { addTip, getUserTips, updateUserTip, deleteUserTip } = require('../controller/tips');
const { addComment, deleteUserComment } = require('../controller/comments');

// Definition des routes
const router = express.Router();

// Route pour la consultation du profil : /profile (GET)
router.get('/api/profile', authenticateToken, getUserProfile);

// Route pour la modification de son profil : /profile (PUT)
router.put('/api/profile', authenticateToken, updateUserProfile);

// Route pour la modification de son mot de passe : /edit-password (PUT)
router.put('/api/edit-password', authenticateToken, editPassword);

// Route pour l'ajout d'une astuce : /add-tip (POST)
router.post('/api/add-tip', authenticateToken, addTip);

// Route pour la consultation de la liste de ses astuces : /my-tips (GET)
router.get('/api/my-tips', authenticateToken, getUserTips);

// Route pour la modification d'une de ses astuces : /my-tips (PUT)
router.put('/api/my-tips', authenticateToken, updateUserTip);

// Route pour la supression d'une de ses astuces : /my-tips (DELETE)
router.delete('/api/my-tips/:id', authenticateToken, deleteUserTip);

// Route pour le dépôt de commentaire : /comment (POST)
router.post('/api/comment', authenticateToken, addComment);

// Route pour la suppression de son propre commentaire : /comment (DELETE)
router.delete('/api/comment/:id', authenticateToken, deleteUserComment);

module.exports = router;