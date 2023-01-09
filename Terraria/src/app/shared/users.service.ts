import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenForm } from './token.service';

// Définition de l'énumérateur UserType
// Correspond au type d'authentification de l'utilisateur
export enum UserType {
  Intern = 0,
  Google = 1,
  Discord = 2
}

// Définitation de la classe User
// Correspond à la réponse envoyée par l'API
export class User{
  id: number | undefined;
  email : string = '';
  username : string = '';
  firstname : string = '';
  lastname : string = '';
  type! : UserType;
  profilePicture : string = '';
  isBanned : boolean = false;
  isAdmin : boolean = false;
  createdAt! : Date;
  updatedAt! : Date;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /// CONSTRUCTEUR
  // Initialisation du client HTTP
  constructor(private http: HttpClient) { }

  /// METHODES
  /// ROUTES DE BASE
  // Fonction d'appel à la route /api/register (POST) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  register(userForm: Object) : Observable<string> {
    return this.http.post('http://localhost:3000/api/register', userForm, {responseType: 'text'});
  }

  // Fonction d'appel à la route /api/login (POST) de l'API
  // Renvoie la réponse de l'API (Formulaire Token)
  login(userForm: Object) : Observable<TokenForm> {
    return this.http.post<TokenForm>('http://localhost:3000/api/login', userForm);
  }

  // Fonction de connexion externe
  // Appelle sur une fenêtre pop-up l'une des routes :
  // -> /auth/google (GET)
  // -> /auth/discord (GET)
  externLogin(type : UserType) {
    switch(type){
      case UserType.Google:
        {
          window.open('http://localhost:3000/auth/google', 'mywindow', "location=1, status=1, scrollbars=1, width=800,height=800");
          return window;
        }
      case UserType.Discord:
        {
          window.open('https://localhost:8000/auth/discord', 'mywindow', "location=1, status=1, scrollbars=1, width=800,height=800");
          return window;
        }
      default:
        {
          window.open('', 'mywindow', '');
          return window;
        }
    }
  }
  /// FIN ROUTES DE BASE

  /// ROUTES UTILISATEURS AUTHENTIFIES
  // Fonction d'appel à la route /api/profile (GET)
  // Renvoie la réponse de l'API (User correspondant à l'ID utilisateur défini lors de l'authentification)
  getProfile(token: string) : Observable<User> {
    return this.http.get<User>('http://localhost:3000/api/profile', {headers: {"Authorization" : `Bearer ${token}`}});
  }

  // Fonction d'appel à la route /api/profile (PUT)
  // Renvoie la réponse de l'API (OK / KO)
  updateProfile(token: string, userForm: FormData) : Observable<string> {
    return this.http.put('http://localhost:3000/api/profile', userForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }

  // Fonction d'appel à la route /api/edit-password (PUT)
  // Renvoie la réponse de l'API (OK / KO)
  editPassword(token: string, userForm: FormData) : Observable<string> {
    return this.http.put('http://localhost:3000/api/edit-password', userForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }
  /// FIN ROUTES UTILISATEURS AUTHENTIFIES

  /// ROUTES ADMINISTRATEURS
  // Fonction d'appel à la route /api/user-list (GET)
  // Renvoie la réponse de l'API (Tableau de User)
  getAllUsers(token: string) : Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/user-list', {headers: {"Authorization" : `Bearer ${token}`}});
  }

  // Fonction d'appel à la route /api/ban-user (PUT)
  // Renvoie la réponse de l'API (OK / KO)
  toggleBanUser(token: string, userForm: Object) : Observable<string> {
    return this.http.put('http://localhost:3000/api/ban-user', userForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }

  // Fonction d'appel à la route /api/promote-user (PUT)
  // Renvoie la réponse de l'API (OK / KO)
  toggleAdminUser(token: string, userForm: Object) : Observable<string> {
    return this.http.put('http://localhost:3000/api/promote-user', userForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }
  /// FIN ROUTES ADMINISTRATEURS
}
