import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


// Définitation de la classe Tip
// Correspond à la réponse envoyée par l'API
export class Tip{
  id : number = 0;
  title : string = '';
  subjectDescription : string = '';
  tipDescription : string = '';
  tipPicture : string = '';
  tags : string = '';
  isAvailable : boolean = false;
  createdAt! : Date;
  updatedAt! : Date;
  userID : number = 0;
  user = {
    username: '',
    profilePicture:''
  };
}
@Injectable({
  providedIn: 'root'
})
export class TipsService {

  /// CONSTRUCTEUR
  // Initialisation du client HTTP
  constructor(private http : HttpClient) { }

  /// METHODES
  /// ROUTES DE BASE
  // Fonction d'appel à la route /api/tips-list (GET) de l'API
  // Renvoie la réponse de l'API (Tableau de Tip validés)
  getAvailableTips() : Observable<Tip[]> {
    return this.http.get<Tip[]>('http://localhost:3000/api/tips-list');
  }

  // Fonction d'appel à la route /api/get-tip/:id (GET) de l'API
  // Renvoie la réponse de l'API (Tip correspondant au paramètre id)
  getTip(tipID : number) : Observable<Tip> {
    return this.http.get<Tip>(`http://localhost:3000/api/get-tip/${tipID}`);
  }
  /// FIN ROUTES DE BASE

  /// ROUTES UTILISATEURS AUTHENTIFIES
  // Fonction d'appel à la route /api/add-tip (POST) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  addTip(token: string, tipForm : FormData) : Observable<string> {
    return this.http.post('http://localhost:3000/api/add-tip', tipForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }

  // Fonction d'appel à la route /api/my-tips (GET) de l'API
  // Renvoie la réponse de l'API (Tableau des Tip associés à l'ID utilisateur défini à la connexion)
  getUserTips(token: string) : Observable<Tip[]> {
    return this.http.get<Tip[]>('http://localhost:3000/api/my-tips', {headers: {"Authorization" : `Bearer ${token}`}});
  }

  // Fonction d'appel à la route /api/my-tips (PUT) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  updateUserTip(token: string, tipForm: Object) : Observable<string> {
    return this.http.put('http://localhost:3000/api/my-tips', tipForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }

  // Fonction d'appel à la route /api/my-tips (DELETE) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  deleteUserTip(token: string, tipID: number) : Observable<string> {
    return this.http.delete(`http://localhost:3000/api/my-tips/${tipID}`, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }
  /// FIN ROUTES UTILISATEURS AUTHENTIFIES

  /// ROUTES ADMINISTRATEURS
  // Fonction d'appel à la route /api/manage-tips (GET) de l'API
  // Renvoie la réponse de l'API (Tableau de Tip en attente de validation)
  getUnavailableTips(token: string) : Observable<Tip[]>{
    return this.http.get<Tip[]>('http://localhost:3000/api/manage-tips', {headers: {"Authorization" : `Bearer ${token}`}});
  }

  // Fontion d'appel à la route /api/manage-tips (PUT) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  validateTip(token: string, tipForm : Object) : Observable<string> {
    return this.http.put('http://localhost:3000/api/manage-tips', tipForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }

  // Fonction d'appel à la route /api/manage-tips (DELETE) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  deleteAdminTip(token: string, tipID: number) : Observable<string> {
    return this.http.delete( `http://localhost:3000/api/manage-tips/${tipID}`, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }
  /// FIN ROUTES ADMINISTRATEURS

  /// PARAMETRES
  // Liste des tags des astuces
  tags : string[] = [
    'Armure',
    'Arme',
    'Biome',
    'Boss',
    'Entité',
    'Mécanique',
    'Mod',
    'PNJ'
  ];
}
