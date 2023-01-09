import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TokenService } from './shared/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : TokenService et Router
  constructor(public tokenService: TokenService, private router : Router){}

  /// METHODES
  // Fonction de déconnexion d'un utilisateur
  // Remet à zéro toutes les données d'authentification
  public disconnect() : void {
    this.tokenService.clearAuthData();
    this.router.navigate(['']);
  }

  // Fonction de redirection vers la liste des astuces de l'utilisateur
  // Uniquement accesible aux utilisateurs authentifiés
  public toMyTips() : void {
    this.router.navigate(['profile/my-tips'], {
      queryParams: { isTipOwner: true },
    });
  }

  // Fonction de redirection vers la liste des astuces en attente de validation
  // Uniquement accessible aux utilisateurs administrateurs
  public toPendingTips() : void {
    this.router.navigate(['admin/pending'], {
      queryParams: { onlyPending: true },
    });
  }

  /// PARAMETRES
  title : string = 'Terraria';
 }
