/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      controller/comments.js                                                                                                         //
//                                                                                                                                     //
//      Définition des fonctions liées à la gestion de commentaires. Fonctionnalités implémentées :                                    //
//      Ajout de commentaire, Suppression de commentaire (par un utilisateur ou un administrateur)                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation du modèle Comment
const { Comment } = require('../model/comment');

// Importation des fonctions de gestion de base de données 
const {Op, comments, selectQuery, insertQuery, deleteQuery, tips, users } = require('../db/instance');

// Fonction de récupération des commentaires associés à une astuce
// Utilisée pour la route /get-comments (GET)
const getTipComments = async(req, res) => {
    try {
        const id = req.params.tipid;
        if (await selectQuery(tips, true, {where: {id: id}}))
            res.status(200).send(await selectQuery(comments, false, {where: {tipID: id},  include: {model: users, attributes:['username', 'profilePicture']}}));
        else
            res.status(400).send('KO : This Tip does not exist');
    }
    catch(error){
        console.error('An error has occured in the getTipComments function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction d'ajout d'un commentaire
// Utilisée pour la route /comment (POST)
const addComment = async(req, res) => {
    try{
        // Récupération des donnée importantes pour le commentaire
        const text = req.body.text;
        const id_tip = req.body.id_tip;
        const id_user = req.user.user.id;

        // Création de l'objet Comment
        const comment = new Comment(text, id_tip, id_user);

        // Vérification de la validité des champs
        if (!comment.isCorrect())
            return res.status(401).send("KO : Please fill the text and the id_tip field");
    
        if (!(await selectQuery(tips, false, {where: {id : comment.id_tip}})))
            return res.status(404).send("KO : This tip does not exist");
        
        await insertQuery(comments, comment.getQueryData());
        res.status(200).send("OK : Comment has been added");
    }
    catch(error){
        console.error('An error has occured in the addComment function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}

// Fonction de suppression de son propre commentaire
// Utilisée pour la route /comment (DELETE)
const deleteUserComment = async(req, res) => {
    deleteComment(req, res, false);
}

// Fonction de suppression d'un commentaire (par un administrateur)
// Utilisée pour la route /delete-comment (DELETE)
const deleteAdminComment = async(req, res) => {
    deleteComment(req, res, true);
}

const deleteComment = async(req, res, bIsAdmin) => {
    try {
        // Vérification de la présence du champs id
        if(!req.params.id){
            return res.status(500).send('KO : please fill the id field to specify which comment you want to delete');
        }

        // Définition de la condition where
        let where = {}
        where.id = req.params.id;
        if (!bIsAdmin) where.userID = req.user.user.id;

        // Vérification de l'existance de l'astuce
        if(!(await selectQuery(comments, true, {where : where}))){
            if(bIsAdmin) return res.status(500).send('KO : This comment does not exist');
            else return res.status(500).send('KO : This comment does not exist or does not belong to you');
        }
        
        // Suppression du commentaire
        await deleteQuery(comments, where);
        res.status(200).send('OK : Comment successfully deleted');

    }
    catch(error){
        console.error('An error has occured in the deleteComment function : ', error);
        res.status(500).send('KO : An error has occured');
    }
}


module.exports = { getTipComments, addComment, deleteUserComment, deleteAdminComment };