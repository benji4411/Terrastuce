/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/tables/relationships.js                                                                                                     //
//                                                                                                                                     //
//      Définition de toutes les relations entre les tables (clés étrangères)                                                          //
//                                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation des différentes tables
const users = require('./users');
const comments = require('./comments');
const tips = require('./tips');

comments.belongsTo(users, {foreignKey: 'userID', foreignKeyConstraint: true});
comments.belongsTo(tips, {foreignKey: 'tipID', foreignKeyConstraint: true});
tips.belongsTo(users, {foreignKey: 'userID', foreignKeyConstraint: true});

module.exports = {users, comments, tips};