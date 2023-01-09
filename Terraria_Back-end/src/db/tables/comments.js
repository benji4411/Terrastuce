/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/tables/comments.js                                                                                                          //
//                                                                                                                                     //
//      Définition de la table comments pour la base de données                                                                        //
//                                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de la bulle d'abstraction Sequelize
const { sequelize, DataTypes } = require('../sequelize');

// Définition table comments
const comments = sequelize.define('comments',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull : false
    }
});

module.exports = comments;