import { Component } from '@angular/core';
import { TokenService } from '../shared/token.service';
import { User, UsersService } from '../shared/users.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { FeedbackService } from '../shared/feedback.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : UsersService, TokenService, FeedbackService, Router
  constructor(
    private usersService: UsersService,
    public tokenService: TokenService,
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  /// METHODES
  // A l'initialisation de la page
  // Renvoie l'utilisateur à la page de connexion si le token est expiré
  // Récupère les données du profil de l'utilisateur sinon
  ngOnInit() : void {
    if (!this.tokenService.getToken()) this.router.navigate(['login']);
    else this.getValues();
  }

  // Fonction de récupération des données du profil de l'utilisateur
  // Si l'utilisateur n'a pas de photo de profil, une image placeholder est sélectionnée
  private getValues() : void {
    this.usersService.getProfile(this.tokenService.getToken()).subscribe({
      next: (response) => {
        this.user = response;
        if (!this.user.profilePicture) this.user.profilePicture = '../../assets/placeholder.jpg';
      },
      error: (error) => {
        this.router.navigate(['']);
      },
    });
  }

   // Fonction d'upload d'image
  // Garde en mémoire l'image sélectionnée à l'aide de l'ajout de fichier
  setTempProfilePicture(event: any) : void {
    this.tempProfilePicture = event.target.files[0];
  }

  // Fonction d'activation du mode d'édition du profil
  beginEditingProfile() : void {
    this.isEditing = true;
    this.editUser = this.user;
  }

  // Fonction d'annulation du mode d'édition du profil
  cancelEditingProfile() : void {
    this.isEditing = false;
    this.profileErrorMessage = '';
  }

  // Fonction de validation des choix d'édition du profil
  // Permet de modifier le nom d'utilisateur, l'adresse mail, le prénom et/ou le nom de famille
  confirmEditingProfile() : void {
    this.isEditing = false;
    const formData = new FormData();
    if (this.editUser.username) formData.append('username', this.editUser.username);
    if (this.editUser.email) formData.append('email', this.editUser.email);
    if (this.editUser.firstname) formData.append('firstname', this.editUser.firstname);
    if (this.editUser.lastname) formData.append('lastname', this.editUser.lastname);
    if (this.tempProfilePicture) formData.append('file', this.tempProfilePicture);

    this.usersService
      .updateProfile(this.tokenService.getToken(), formData)
      .subscribe({
        next: (response) => {
          this.getValues();
          this.feedbackService.sendFeedback('Profil mis à jour');
        },
        error: (error) =>{
          switch(error.error) {
            case 'KO : This email is already registered':
              this.profileErrorMessage = "Cette adresse mail est déjà enregistré.";
              break;
            case 'KO : This username is already taken':
              this.profileErrorMessage = "Ce nom d'utilisateur est déjà enregistré.";
              break;
          }
        }
      });
  }

  // Fonction de validation de modification du mot de passe
  // Renvoie un feedback en cas de réussite ou non de la modification (Ancien mot de passe correct, mise à jour réussie..)
  confirmEditingPassword() : void {
    const userData = new FormData();
    userData.append("oldPassword", this.oldPassword);
    userData.append("newPassword", this.newPassword);
    this.usersService.editPassword(this.tokenService.getToken(), userData).subscribe(
      {
        next: (response) => {
          this.feedbackService.sendFeedback('Nouveau mot de passe enregistré');
          this.isEditingPassword = false;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
          this.passwordErrorMessage = '';
        },
        error: (error) => {
          this.passwordErrorMessage = "Entrez un mot de passe valide et réessayez."
        }
      });
  }

  // Fonction d'annulation de la modification du mot de passe
  cancelEditingPassword() : void {
    this.isEditingPassword = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.passwordErrorMessage = '';
  }

  // Fonction de récupération de message d'errur pour le champ Nouveau mot de passe
  getErrorMessagePassword() : string {
    return this.newPasswordFormControl.hasError('required') ? 'Champ requis' : (this.newPasswordFormControl.hasError('minlength') ? 'Au moins 8 caractères' : ''); 
  }

  // Fonction de récupération de message d'errur pour le champ Ancien mot de passe
  getErrorMessageOldPassword() : string {
    return this.oldPasswordFormControl.hasError('required') ? 'Champ requis' : (this.newPasswordFormControl.hasError('minlength') ? 'Au moins 8 caractères' : ''); 
  }

  /// PARAMETRES
  /// INFORMATIONS LIEES AU PROFIL
  // Mode d'édition du profil
  isEditing : boolean = false;
  // Utilisateur courant
  user : User = new User();
  // Utilisateur édité
  editUser : User = new User();
  // Fichier image de profil
  tempProfilePicture!: File;
  // Message d'erreur lors de la mise à jour du profil
  profileErrorMessage : string = '';
  
  /// VARIABLES POUR LA MODIFICATION DU MOT DE PASSE
  // Mode d'édition du mot de passe
  isEditingPassword : boolean = false;
  // Données du formulaire de modification du mot de passe
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  hideOldPassword : boolean = true;
  hideNewPassword : boolean = true;
  hideConfirmNewPassword : boolean = true;
  // Contrôles de formulaire
  oldPasswordFormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  // Message d'erreur lors de la mise à jour du mot de passe
  passwordErrorMessage : string = '';
}
