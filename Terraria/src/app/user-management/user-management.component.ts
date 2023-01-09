import { Component } from '@angular/core';

import { Sort } from '@angular/material/sort';
import { TokenService } from '../shared/token.service';
import { Router } from '@angular/router';
import { User, UsersService } from '../shared/users.service';
import { FeedbackService } from '../shared/feedback.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent {
  
  /// CONSTRUCTEUR
  // Initialisation des différents services : FeedBackService, UsersService, TokenService et Router
  constructor(private feedbackService: FeedbackService, 
    private usersService : UsersService, 
    private tokenService : TokenService, 
    private router : Router) {}


  /// METHODES
  // A l'initialisation de la page
  // Réalise une mise à jour de la liste d'utilisateurs
  ngOnInit() : void {
    if(!this.tokenService.getAdminState()) this.router.navigate(['access-denied']);
    this.updateUserList();
  }

  // Fonction de mise à jour de la liste d'utilisateur
  // Réalise un tri des utilisateurs 
  private updateUserList() : void {
    this.usersService.getAllUsers(this.tokenService.getToken()).subscribe((response) => {
      this.users = response;
      this.sortedUsers = this.users.slice();
    });
  }

  // Fonction de tri de la liste d'utilisateur
  sortData(sort: Sort) : void {
    const data = this.users.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedUsers = data;
    } else {
      this.sortedUsers = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  // Fonction de gestion d'un utilisateur
  // Prend en paramètres un identifiant utilisateur, son nom, et le type de gestion de l'utilisateur (promotion, dégradation, bannissement, débannissement)
  manageUser(username: string, id: number, managementType : number) : void {

    // Définition des différents textes pour le feedback
    let dialogText = '';
    let feedbackText = '';
    switch(managementType){
      case this.UserManagementType.PROMOTE:
        dialogText = `Promouvoir ${username} ?`;
        feedbackText = `Promotion de ${username}`;
        break;
      case this.UserManagementType.DEMOTE:
        dialogText = `Dégrader ${username} ?`;
        feedbackText = `Dégradation de ${username}`;
        break;
      case this.UserManagementType.BAN:
        dialogText = `Bannir ${username} ?`;
        feedbackText = `Bannissement de ${username}`;
        break;
      case this.UserManagementType.UNBAN:
        dialogText = `Débannir ${username} ?`;
        feedbackText = `Débannissement de ${username}`;
        break;
      default:
        break;
    }

    // Traitement de la réponse utilisateur
    let response = confirm(dialogText);
    if (response) {
      this.feedbackService.sendFeedback(feedbackText);
      var managementResponse = 
        (managementType === this.UserManagementType.BAN || 
         managementType === this.UserManagementType.UNBAN) ? 
         this.usersService.toggleBanUser(this.tokenService.getToken(), {id: id}) :
         this.usersService.toggleAdminUser(this.tokenService.getToken(), {id: id});
      managementResponse.subscribe((response) => {
        this.updateUserList();
      })
    }
  }

  /// PARAMETRES
  // Pseudo enum interne pour la définition du type de gestion d'un utilisateur
  UserManagementType = {
    PROMOTE: 1,
    DEMOTE: 2,
    BAN: 3,
    UNBAN: 4
  }

  // Données de recherche par filtre
  searchUsername : string = '';
  searchId!: number;
  searchBanned : string = '';
  
  // Liste triée et non triée des utilisateurs
  users : User[] = [];
  sortedUsers : User[] = [];
}
