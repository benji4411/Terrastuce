/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      model/comment.js                                                                                                               //
//                                                                                                                                     //
//      Classe Comment pour des opérations simples :                                                                                   //
//      Vérification des champs, conversion en objet pour l'insertion dans la base de données                                          //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Définition de la classe comentaire
class Comment {
    // Constructeur basique
    constructor(text, id_tip, id_user){
        this.text = text;
        this.id_tip = id_tip;
        this.id_user = id_user
    }

    // Vérification de la validité d'une entrée (champs importants non vides)
    isCorrect() {
        return this.text && this.id_tip;
    }

    // Conversion des données en objet pour les requêtes SQL
    getQueryData() {
        return {
            text: this.text,
            tipID: this.id_tip,
            userID: this.id_user
        };
    }
}

module.exports = { Comment } ;