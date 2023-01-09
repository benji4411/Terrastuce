/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/sequelize.js                                                                                                                //
//                                                                                                                                     //
//      Importation et initialisation du module Sequelize                                                                              //
//      Mise en place de fonctions pour l'abstraction de requêtes SQL (select, insert, update, delete)                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de Sequelize, des types de données et des opérateurs
const { Sequelize, DataTypes, Op } = require('sequelize');

// Initilisation de Sequelize
const sequelize = new Sequelize(
    'progwebserveur',
    'root',
    'root', {
        host: 'localhost',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to database : ', error);
});

// Fonctions Sequelize (abstraction)
// Pour les requêtes SELECT, INSERT, UPDATE, DELETE...
const selectQuery = async(table, bIsUnique, condition) => {
    try {
        if (bIsUnique) return await table.findOne(condition);
        else return await table.findAll(condition);
    } catch (error) {
        console.error('An error has occured in the selectQuery function : ', error);
    }
}

const insertQuery = async(table, values) => {
    try {
        await table.create(values);
    } catch (error) {
        console.error('An error has occured in the insertQuery function : ', error);
    }
}

const updateQuery = async(table, values, where) => {
    try {
        await table.update(values, { where: where });
    } catch (error) {
        console.error('An error has occured in the updateQuery function : ', error);
    }
}

const deleteQuery = async(table, where) => {
    try {
        await table.destroy({ where: where });
    } catch (error) {
        console.error('An error has occured in the deleteQuery function : ', error);
    }
}

module.exports = { sequelize, DataTypes, Op, selectQuery, insertQuery, updateQuery, deleteQuery };