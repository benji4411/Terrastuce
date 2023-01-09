import { Injectable } from '@angular/core';

// Définition de la classe TokenForm
// Constitué du token de l'utilisateur authentifié, son état administrateur, son identifiant et son type d'authentification
export class TokenForm  {
  token : string = '';
  isAdmin : boolean = false;
  userID : number = 0;
  authType : string = '';
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    
  /// CONSTRUCTEUR
  constructor() { }

  /// METHODES
  // Fonction de récupération du token, enregistré dans le localStorage
  getToken() : string {
    const token = localStorage.getItem("token");  
    if(!token){  
      return '';  
    }  
    return token;
  }

  // Fonction de récupération de l'état administrateur, enregistré dans le localStorage
  getAdminState() : boolean{
    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    return isAdmin;
  }

  // Fonction de récupération de l'identificant utilisateur, enregistré dans le localStorage
  getUserID() : number{
    const userID = localStorage.getItem("userID");
    if (!userID)
      return 0;
    return parseInt(userID);
  }

  // Fonction de récupération du type d'authentification, enregistré dans le localStorage
  getAuthType() : string {
    const authType = localStorage.getItem("authType");
    if (!authType) return '';
    return authType;
  }

  // Fonction d'enregistrement des données reçues lors de la connexion
  // Enregistre toutes les données d'authentification dans le localStorage
  saveAuthData(token: string, isAdmin: boolean, userID : number, authType: string) : void {  
    localStorage.setItem('token', token);  
    localStorage.setItem('isAdmin', String(isAdmin));
    localStorage.setItem('userID', String(userID));
    localStorage.setItem('authType', authType);
  }  

  // Fonction de réinitilisation des données d'authentification
  clearAuthData() : void {  
    localStorage.clear();
  } 

}
