/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      controller/passport_config.js                                                                                                  //
//                                                                                                                                     //
//      Configuration des méthodes passport pour les authentifications externes                                                        //
//      Authentifications ajoutées : Google, Facebook, Discord                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Importation de passport
const passport = require('passport');

// Importation des fonctions de gestion de base de données 
const {users, selectQuery, insertQuery, Op} = require("../db/instance");

// Importation du model User
const { User, UserType } = require('../model/User');
const { hashPassword } = require('./password');

// Importation de la stratégie passport de Google
const GoogleStrategy = require('passport-google-oauth20').Strategy;

GOOGLE_CLIENT_ID = '1069624365177-189mn042i6qt8qcugpopekmhqv1snjdp.apps.googleusercontent.com';
GOOGLE_CLIENT_SECRET = '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';

// Definition de la Strategie Passport de connexion via google
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, done)=> {
    // Si l'utilisateur google n'est pas encore dans notre base de données, on l'ajoute
    if(!await selectQuery(users, true, {where: {[Op.and]: [{password: await hashPassword(profile.id)},{type: UserType.GOOGLE}]}})){
      // Création d'un nouvel utilisateur
      let user = new User(profile.emails[0].value, await hashPassword(profile.id), profile.displayName, profile.name.givenName, profile.name.familyName, UserType.GOOGLE, profile.photos[0].value, false, false);
      console.log(user);
      // Ajout de l'utilisateur dans la base de données
      await insertQuery(users, user.getQueryData());
    }
    done(null, profile);
  }
));

DISCORD_CLIENT_ID = '1055543251391741992';
DISCORD_CLIENT_SECRET = 's_9JDp34pUFL5gKSvacR8gQGjUgz1gBd';

// Importation de la stratégie passport de Discord
const DiscordStrategy = require('passport-discord').Strategy;

// Definition de la Strategie Passport de connexion via discord
passport.use(new DiscordStrategy({
  clientID: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  callbackURL: "/auth/discord/callback",
  scope : ['identify', 'email']
},
async(accessToken, refreshToken, profile, done)=> {
  // Si l'utilisateur discord n'est pas encore dans notre base de données, on l'ajoute
  if(!await selectQuery(users, true, {where: {[Op.and]: [{password: await hashPassword(profile.id)},{type: UserType.DISCORD}]}})){
    const profilePicture = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
    let user = new User(profile.email,  await hashPassword(profile.id), profile.username, null, null, UserType.DISCORD, profilePicture, false, false);
    // Ajout de l'utilisateur dans la base de données
    await insertQuery(users, user.getQueryData());
  }
  done(null, profile);
}
));