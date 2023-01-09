import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenForm, TokenService } from '../shared/token.service';

import { UsersService, UserType } from '../shared/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : UsersServices, TokenService, Router
  constructor(private usersService : UsersService,
              private tokenService : TokenService,
              private route : Router){}

  /// METHODES
  // Fonction de récupération de message d'erreur pour le champ Nom d'utilisateur
  getErrorMessageUsername() : string {
    return this.usernameFormControl.hasError('required') ? 'Champ requis' : '';
  }

  // Fonction de récupération de message d'erreur pour le champ Mot de passe
  getErrorMessagePassword() : string {
    return this.passwordFormControl.hasError('required') ? 'Champ requis' : '';
  }

  // Fonction de connexion via compte Google
  connectGoogle() : void {
    this.connectExtern(UserType.Google);
  }

  // Fonction de connexion via compte Discord
  connectDiscord() : void {
    this.connectExtern(UserType.Discord);
  }

  // Fonction de connexion via compte externe
  // Affiche une fenêtre pop-up pour l'authentification externe
  // Renvoie à la page principale à la réussite de la connexion
  // Sinon affiche l'erreur obtenue sur la fenêtre pop-up
  private connectExtern(type : UserType) : void {
    var window = this.usersService.externLogin(type);

    var listener = (message : any) => {
      const tokenForm : TokenForm = message.data;
      this.tokenService.saveAuthData(tokenForm.token,tokenForm.isAdmin, tokenForm.userID, tokenForm.authType);
      this.route.navigate(['']);
      window.removeEventListener('message', listener);
    };

    window.addEventListener('message', listener);
  }

  // Fonction de vérification des champs du formulaire
  isValidForm(): boolean {
    return this.passwordFormControl.valid && this.usernameFormControl.valid;
  }

  // Fonction de connexion au compte de l'utilisateur
  // Récupère les informations des champs Nom d'utilisateur et Mot de passe
  // Renvoie à la page principale à la réussite de la connexion
  // Si erreur, affiche l'erreur en question (Identificants invalides, compte banni)
  login() : void {
    if (this.isValidForm()){
      const userForm = {
        username: this.usernameFormControl.value,
        password: this.passwordFormControl.value
      };
      this.usersService.login(userForm).subscribe({
        next: (response) => {
          this.tokenService.saveAuthData(response.token,response.isAdmin, response.userID, response.authType);
          this.route.navigate(['']);  
        },
        error: (error) => {
          switch(error.error){
            case 'KO : Bad credential/incorect user':
              this.errorMessage = 'Identifiant ou mot de passe invalide.';
              break;
            case 'KO : This user is banned':
              this.errorMessage = 'Votre compte est banni.'
              break;
          }
        }
      })
    } 
  }

  /// PARAMETRES
  // Affichage ou non du mot de passe
  hidePassword : boolean = true;
  // Contrôles de champ du formulaire
  passwordFormControl = new FormControl('', [Validators.required]);
  usernameFormControl = new FormControl('', [Validators.required]);
  // Message d'erreur lors de la connexion
  errorMessage : string = '';
}
