/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      controller/user.js                                                                                                             //
//                                                                                                                                     //
//      Définition des fonctions liées à l'importation de fichier (upload, vérification d'extension)                                   //
//      Définition de listes d'extension à accepter, selon un type de fichier (image, texte)                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de File System
const fs = require('fs');

// Définition des listes d'extension
const imageFileExtension = ['png', 'jpeg', 'jpg', 'gif'];

// Fonction d'upload
// Utilisée pour toutes les routes nécessitant l'upload de fichiers
const uploadFile = async(file) => {

    if (!file) return null;
    const folderName = '../Terraria/src/assets/uploads';
    try{
        if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);
    }
    catch(error){
        console.error('An error has occured in the file system routine : ', error);
    }
    
    const filePath = `assets/uploads/${file.name}`;
    await file.mv(`../Terraria/src/${filePath}`, (error) => {
        if (error) return null;
    });
    // Le traitement futur des images uploadées aura toujours un chemin de la forme ../../assets/uploads/NOM.extension
    // Afin de limiter les calculs côté Client, nous enregistrerons directement le chemin dans la base de données
    return `../../${filePath}`;
}

// Fonction permet la vérification de l'extension du fichier à uploader
// Sert notamment à vérifier si l'on upload une image de format .png
const checkExtension = async(fileName, extensionList) => {
    let result = false;
    for (const extension in extensionList){
        result |= fileName.endsWith(`.${extension}`);
    }
    return result;
}

module.exports = { uploadFile, checkExtension, imageFileExtension };