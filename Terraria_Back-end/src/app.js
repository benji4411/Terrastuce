/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      app_test.js                                                                                                                    //
//                                                                                                                                     //
//      Coeur de l'API. Exécuté via la commande npm start. Permet de tester les différentes routes.                                    //
//      Auteurs : Maxime EMONNOT  -   Benjamin MAHOUDEAU                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation des bibliothèques ExpressJS
const express = require('express');
const upload = require('express-fileupload');
const cors = require('cors');

// Importation des routes
const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure_routes');
const adminRoutes = require('./routes/admin_routes');

// Imporation bibliothèques pour le serveur HTTPS
const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.crt', 'utf8');

// Initialisation credentials
const credentials = {key: privateKey, cert: certificate};

// Initialisation passport pour l'authentification Google, Facebook, Discord
require('./controller/passport_config');

// Initalisation de la base de données
require('./db/instance');

// Initialisation d'ExpressJS
const app = express();
const port = 3000;

// Initialisation CORS
const corsOptions = {
    origin: 'https://localhost:4200',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Express middleware permettant de reconnaitre les requêtes entrantes en json et les fichiers uplodés
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload());

// Utilisation des routes définires dans routes.js, secure_routes.js et admin_routes.js
app.use(routes);
app.use(secureRoutes);
app.use(adminRoutes);

// Ecoute les connexions entrantes sur le port défini ligne 22 (dans notre cas, le port 3000)
app.listen(port, () => { console.log(`Serveur waiting at http://localhost:${port}`); });

// Ouverture serveur HTTPS
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8000);