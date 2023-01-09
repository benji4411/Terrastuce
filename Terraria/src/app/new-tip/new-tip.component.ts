import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from '../shared/feedback.service';
import { Tip, TipsService } from '../shared/tips.service';
import { TokenService } from '../shared/token.service';
@Component({
  selector: 'app-new-tip',
  templateUrl: './new-tip.component.html',
  styleUrls: ['./new-tip.component.css'],
})
export class NewTipComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : TokenService, TipsService, FeedbackService, Router
  constructor(private tokenService: TokenService, 
    public tipsService : TipsService, 
    private feedbackService : FeedbackService,
    private router : Router){}

  /// METHODES
  // Fonction d'upload d'image
  // Garde en mémoire l'image sélectionnée à l'aide de l'ajout de fichier
  setTipPicture(event : any) : void {
    this.tempTipPicture = event.target.files[0];
  }

  // Fonction d'ajout d'astuce
  // Récupère les informations concernant le titre, la description du sujet de l'astuce, la description de l'astuce, les tags sélectionnés, et potentillement la photo du sujet
  // Renvoie à la page principale à la réussite de l'ajout
  addTip() : void {
    const formData = new FormData();
    formData.append("title", this.tempTip.title);
    formData.append("subjectDescription", this.tempTip.subjectDescription);
    formData.append("tipDescription", this.tempTip.tipDescription);
    formData.append("tags", this.selectedTags.toString());
    if (this.tempTipPicture) formData.append("file", this.tempTipPicture);

    this.tipsService.addTip(this.tokenService.getToken(), formData).subscribe((response) => {
      this.feedbackService.sendFeedback(`Astuce ${this.tempTip.title} ajoutée`);
      this.router.navigate(['']);
    });
  }

  /// PARAMETRES
  // Tags sélectionnés
  selectedTags: string[] = [];
  // Astuce en cours d'ajout
  tempTip : Tip = new Tip();
  // Fichier image lié à l'astuce
  tempTipPicture!: File;
}
