import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../shared/token.service';

import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : UsersService, Router, TokenService
  constructor(private usersService : UsersService,
     private route : Router, 
     private tokenService : TokenService) {}

  /// METHODES
  // Fonction de récupération de message d'erreur pour le champ Adresse mail
  getErrorMessageEmail() : string {
    return this.emailFormControl.hasError('require') ? 'Champ requis' : (this.emailFormControl.hasError('email') ? 'Email non valide' : '');
  }

  // Fonction de récupération de message d'errur pour le champ Mot de passe
  getErrorMessagePwd() : string {
    return this.passwordFormControl.hasError('required') ? 'Champ requis' : (this.passwordFormControl.hasError('minlength') ? 'Au moins 8 caractères' : '');
  }

  // Fonction de récupération de message d'erreur pour le champ Nom d'utilisateur
  getErrorMessageUsername() : string {
    return this.usernameFormControl.hasError('required') ? 'Champ requis' : '';
  }

  // Fonction de récupération de message d'erreur pour le champ Nom de famille
  getErrorMessageLastName() : string {
    return this.lastnameFormControl.hasError('required') ? 'Champ requis' : '';
  }

  // Fonction de récupération de message d'erreur pour le champ Prénom
  getErrorMessageFirstName() : string {
    return this.firstnameFormControl.hasError('required') ? 'Champ requis' : '';
  }

  // Fonction de vérification des champs du formulaire
  isValidForm() : boolean {
    return (
      this.firstnameFormControl.valid &&
      this.lastnameFormControl.valid &&
      this.passwordFormControl.valid &&
      this.emailFormControl.valid &&
      this.usernameFormControl.valid &&
      this.password == this.passwordConfirmation
    );
  }

  // Fonction d'inscription de l'utilisateur
  // Connecte automatiquement l'utilisateur au site à la réussite de l'inscription, et le renvoie à la page principale
  register() : void {
    if (this.isValidForm()){
      const userForm = {
        firstname: this.firstnameFormControl.value,
        lastname: this.lastnameFormControl.value,
        username: this.usernameFormControl.value,
        email: this.emailFormControl.value,
        password: this.passwordFormControl.value
      }    

      this.usersService.register(userForm).subscribe({
        next: (response) => {
          this.route.navigate(['']);
          this.usersService.login(userForm).subscribe({
            next: (response) => {
              this.tokenService.saveAuthData(response.token,response.isAdmin, response.userID, response.authType);
            }
          });
        },
        error: (error) => {
          this.errorMessage = "Cet utilisateur existe déjà.";
        }
      });
    }
  }

  /// PARAMETRES

  // Controles de formulaire
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  usernameFormControl = new FormControl('', [Validators.required]);
  firstnameFormControl = new FormControl('', [Validators.required]);
  lastnameFormControl = new FormControl('', [Validators.required]);

  // Données liées au mot de passe
  hidePassword : boolean = true;
  hidePasswordConfirmation : boolean = true;
  password : string = '';
  passwordConfirmation : string = '';

  // Message d'erreur lors de l'inscription
  errorMessage : string = '';
}
