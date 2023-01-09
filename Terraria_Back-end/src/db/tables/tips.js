/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/tables/tips.js                                                                                                              //
//                                                                                                                                     //
//      Définition de la table tips pour la base de données                                                                            //
//                                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de la bulle d'abstraction Sequelize
const { sequelize, DataTypes } = require('../sequelize');

// Définition table tips
const tips = sequelize.define('tips',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    subjectDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipPicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags: {
        type : DataTypes.TEXT,
        allowNull: true
    },
    isAvailable: {
        type : DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = tips;