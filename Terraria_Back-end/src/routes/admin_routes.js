/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      routes/admin_routes.js                                                                                                         //
//                                                                                                                                     //
//      Définition des routes administratives                                                                                          //
//      Utilisables par les administrateurs authentifés                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation d'ExpressJS
const express = require("express");

//Importation des fonctions extérieures
const { authenticateToken, isAdmin } = require("../controller/token");
const { validateTip, deleteAdminTip, getWaitingTipsList } = require('../controller/tips');
const { deleteAdminComment } = require('../controller/comments');
const { getAllUsers, toggleBanUser, toggleAdminUser} = require('../controller/users');

// Definition des routes
const router = express.Router();

// Route pour la récupération de la liste des astuces : /manage-tips (GET)
router.get('/api/manage-tips', authenticateToken, isAdmin, getWaitingTipsList);

// Route pour la validation d'une astuce : /manage-tips (PUT)
router.put('/api/manage-tips', authenticateToken, isAdmin, validateTip);

// Route pour la suppression d'une astuce : /manage-tips (DELETE)
router.delete('/api/manage-tips/:id', authenticateToken, isAdmin, deleteAdminTip);

// Route pour la suppression d'un commentaire : /delete-comment (DELETE)
router.delete('/api/delete-comment/:id', authenticateToken, isAdmin, deleteAdminComment);

// Route pour accéder à la liste des utilisateurs : /user-list (GET)
router.get('/api/user-list', authenticateToken, isAdmin, getAllUsers);

// Route pour bannir/débannir un utilisateur : /ban-user (PUT)
router.put('/api/ban-user', authenticateToken, isAdmin, toggleBanUser);

// Route pour la promotion d'un utilisateur (lambda à administrateur) : /promote-user (PUT)
router.put('/api/promote-user', authenticateToken, isAdmin, toggleAdminUser);

module.exports = router;