// Importation de la bibliothèque CryptoJS
const CryptoJS = require('crypto-js');

// Initialisation mot secret pour le hashage du mot de passe
SECRET_HASH_KEY = "215gme39jcmj33"

// Fonction de hashage du mot de passe
const hashPassword = async(password) => {
    return CryptoJS.HmacSHA512(password, SECRET_HASH_KEY).toString();
}

module.exports = { hashPassword };
