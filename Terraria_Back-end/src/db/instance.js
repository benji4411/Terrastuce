/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/instance.js                                                                                                                 //
//                                                                                                                                     //
//      Initialisation et démarrage de l'instance de base de données                                                                   //
//      Création automatique d'un utilisatteur administrateur par défaut                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupération fonctions sequelize
const { sequelize, Op, selectQuery, insertQuery, updateQuery, deleteQuery } = require('./sequelize');

// Initialisation base de données..
const connection = require('./connect');
const {users, tips, comments } = require('./tables/relationships');
const { User, UserType } = require('../model/user');
const { hashPassword } = require('../controller/password');

const createAdmin = async() => {
    const admin = new User('admin@admin', await hashPassword('admin'), 'admin', 'admin', 'admin', UserType.INTERN, '../../assets/adminPicture.png', false, true);
    if (!await selectQuery(users, true, {where: {[Op.and]: [{[Op.or] : [{username: admin.username},{email: admin.email}]},{type: UserType.INTERN}]}}))
        insertQuery(users, admin.getQueryData());
}

sequelize.sync().then(() => {
    console.log('Tables created successfully!');
    // Ajout d'un utilisateur Admin par défaut, au premier démarrage de l'API
    createAdmin();
}).catch((error) => {
    console.error('Unable to create tables : ', error);
});

module.exports = {sequelize, Op, connection, users, tips, comments, selectQuery, insertQuery, updateQuery, deleteQuery};

