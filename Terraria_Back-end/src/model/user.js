/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      model/user.js                                                                                                                  //
//                                                                                                                                     //
//      Enum UserType pour différencier l'authentification (Interne / Externe). Classe User pour des opérations simples :              //
//      Vérification des champs, conversion en objet pour l'insertion dans la base de données                                          //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Définition de l'enum UserType
const UserType = {INTERN: 'Intern', GOOGLE: 'Google', DISCORD: 'Discord'};

// Définition de la classe utilisateur
class User {
    // Constructeur basique
    constructor(email, password, username, firstname, lastname, type, profilePicture, isBanned, isAdmin){
        this.email = email;
        this.password = password;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.type = type;
        this.profilePicture = profilePicture;
        this.isBanned = isBanned;
        this.isAdmin = isAdmin;
    }

    // Vérification de la validité d'une entrée (champs importants non vides)
    isCorrect() {
        return this.email && this.password && this.username && this.firstname && this.lastname;
    }

    // Conversion des données en objet pour les requêts SQL
    getQueryData() {
        return {
            email: this.email,
            password: this.password,
            username: this.username,
            firstname: this.firstname,
            lastname: this.lastname,
            type: this.type,
            profilePicture: this.profilePicture,
            isBanned: this.isBanned,
            isAdmin: this.isAdmin
        };
    }
}

module.exports = { User, UserType } ;