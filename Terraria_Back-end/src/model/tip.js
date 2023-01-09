/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      model/tip.js                                                                                                                   //
//                                                                                                                                     //
//      Classe Tip pour des opérations simples :                                                                                       //
//      Vérification des champs, conversion en objet pour l'insertion dans la base de données                                          //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Définition de la classe astuce
class Tip {
    // Constructeur basique
    constructor(title, subjectDescription, tipDescription, tipPicture, id_user, tags, isAvailable){
        this.title = title;
        this.subjectDescription = subjectDescription;
        this.tipDescription = tipDescription;
        this.tipPicture = tipPicture;
        this.id_user = id_user;
        this.tags = tags;
        this.isAvailable = isAvailable;
    }

    // Vérification de la validité d'une entrée (champs importants non vides)
    isCorrect() {
        return this.title && this.subjectDescription && this.tipDescription;
    }

    // Conversion des données en objet pour les requêtes SQL
    getQueryData() {
        return {
            title: this.title,
            subjectDescription: this.subjectDescription,
            tipDescription: this.tipDescription,
            tipPicture: this.tipPicture,
            tags: this.tags,
            userID: this.id_user,
            isAvailable : this.isAvailable
        };
    }
}

module.exports = { Tip } ;