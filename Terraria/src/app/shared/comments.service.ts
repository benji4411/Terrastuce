import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Définitation de la classe Comment
// Correspond à la réponse envoyée par l'API
export class Comment{
  id : number = 0;
  text : string = '';
  createdAt! : Date;
  updatedAt! : Date;
  userID : number = 0;
  user = {
    username: '',
    profilePicture:''
  };
  tipID : number = 0;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  /// CONSTRUCTEUR
  // Initialisation du client HTTP
  constructor(private http : HttpClient) { }

  /// METHODES
  /// ROUTES DE BASE
  // Fonction d'appel à la route /api/get-comments/:tipid (GET) de l'API
  // Renvoie la réponse de l'API (Tableau de Comment associés au paramètre tipid)
  getTipComments(tipID: number) : Observable<Comment[]>{
    return this.http.get<Comment[]>(`http://localhost:3000/api/get-comments/${tipID}`);
  }
  /// FIN ROUTES DE BASE

  /// ROUTES UTILISATEURS AUTHENTIFIES
  // Fonction d'appel à la route /api/comment (POST) de l'API
  // Renvoie la réponse de l'API (OK / KO)
  addComment(token: string, commentForm: Object) : Observable<string> {
    return this.http.post('http://localhost:3000/api/comment', commentForm, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }

  // Fonction d'appel à la route /api/comment (DELETE)
  // Renvoie la réponse de l'API (OK / KO)
  deleteUserComment(token: string, commentID: number) : Observable<string> {
    return this.http.delete(`http://localhost:3000/api/comment/${commentID}`,  {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }
  /// FIN ROUTES UTILISATEURS AUTHENTIFIES

  /// ROUTES ADMINISTRATEURS
  // Fonction d'appel à la route /api/delete-comment (DELETE)
  // Renvoie la réponse de l'API (OK / KO)
  deleteAdminComment(token: string, commentID: number) : Observable<string> {
    return this.http.delete(`http://localhost:3000/api/delete-comment/${commentID}`, {headers: {"Authorization" : `Bearer ${token}`}, responseType: 'text'});
  }
  /// FIN ROUTES ADMINISTRATEURS
}
