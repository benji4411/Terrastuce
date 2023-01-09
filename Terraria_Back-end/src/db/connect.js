/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      db/connect.js                                                                                                                  //
//                                                                                                                                     //
//      Permet la connexion à la base de donnée MySQl                                                                                  //
//                                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de MySQL2
const mySql = require('mysql2');

const connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'progwebserveur'
});

module.exports = connection;