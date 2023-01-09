/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/tables/users.js                                                                                                             //
//                                                                                                                                     //
//      Définition de la table users pour la base de données                                                                           //
//                                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de la bulle d'abstraction Sequelize
const { sequelize, DataTypes } = require('../sequelize');

// Définition table users
const users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull : false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull : false
    },
    username: {
        type: DataTypes.STRING(64),
        allowNull : false
    },
    firstname: {
        type: DataTypes.STRING(32)
    },
    lastname: {
        type: DataTypes.STRING(32)
    },
    type: {
        type: DataTypes.ENUM('Intern', 'Google', 'Discord'),
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isAdmin:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = users;