import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../shared/feedback.service';
import { TipsService, Tip } from '../shared/tips.service';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.css'],
})
export class TipsListComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : TipsService, TokenService, FeedbackService, ActivatedRoute, Router
  constructor(public tipsService : TipsService,
      public tokenService : TokenService,
      private feedbackService: FeedbackService, 
      private activatedRoute: ActivatedRoute, 
      private router : Router) {}
 
  /// METHODES
  // A l'initialisation de la page
  // Récupère l'ensemble des paramètres envoyés via le router
  // Réalise une mise à jour de la liste des astuces
  ngOnInit() : void {
    this.activatedRoute.queryParams.subscribe((params) => {
    this.isTipOwner = params['isTipOwner'];
    this.onlyPending = params['onlyPending'];
    if(!this.tokenService.getAdminState() && this.onlyPending) this.router.navigate(['access-denied']);
  });
    this.updateTipsList();
  }

  // Fonction de mise à jour de la liste des astuces
  // Prend en compte les paramètres envoyés via router afin d'obtenir différentes informations
  private updateTipsList() : void {
    var responseRoutine = (response : any) => {
      this.tips = response;
      this.sortedTips = this.tips.slice();
    }

    if (this.isTipOwner) this.tipsService.getUserTips(this.tokenService.getToken()).subscribe(responseRoutine);
    else if (this.onlyPending) this.tipsService.getUnavailableTips(this.tokenService.getToken()).subscribe(responseRoutine);
    else this.tipsService.getAvailableTips().subscribe(responseRoutine);
  }

  // Fonction de tri des astuces
  sortData(sort: Sort) : void {
    const data = this.tips.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedTips = data;
    } else {
      this.sortedTips = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  // Fonction de redirection vers la page d'astuce
  // Prend en paramètre l'identifiant de l'astuce dont les informations doivent être récupérées
  // Cet identifiant est renvoyé à la page suivante
  getTipInfos(tipID: number) : void {
    this.router.navigate(['tip'], {queryParams: {tipID: tipID}});
  }

  // Fonction de suppression d'astuce
  // Prend en paramètres l'identificant d'une astuce, son titre, et l'état administrateur de l'utilisateur demandant la suppression de l'astuce
  deleteTip(tipName: string, tipID: number, isAdmin : boolean) : void {
    let response = confirm(`Supprimer ${tipName} ?`);
    if (response) {
      this.feedbackService.sendFeedback(`Suppression de ${tipName}`);
      var deleteTipResponse = (isAdmin) ? 
      this.tipsService.deleteAdminTip(this.tokenService.getToken(), tipID) : 
      this.tipsService.deleteUserTip(this.tokenService.getToken(), tipID);
      deleteTipResponse.subscribe((responses) => {
        this.updateTipsList();
      });
    }
  }

  // Fonction de validation d'astuce
  // Prend en paramètres l'identifiant d'une astuce et son titre
  validateTip(tipName: string, tipID: number) : void {
    let response = confirm(`Valider ${tipName} ?`);
    if (response) {
      this.feedbackService.sendFeedback(`Validation de ${tipName}`);
      this.tipsService.validateTip(this.tokenService.getToken(), {id: tipID}).subscribe((response) => {
        this.updateTipsList();
      });
    }
  }

  /// PARAMETRES
  // Paramètres récupérés via Router
  isTipOwner : boolean = false;
  onlyPending : boolean = false;
  
  // Données de recherche par filtre
  searchTitle : string = '';
  searchAuthor : string = '';
  selectedTags: string[] = [];
  
  // Liste trié et non-triée des astuces
  tips : Tip[] = [];
  sortedTips : Tip[] = [];
}
