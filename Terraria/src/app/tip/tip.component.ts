import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService, Comment} from '../shared/comments.service';
import { FeedbackService } from '../shared/feedback.service';
import { Tip, TipsService } from '../shared/tips.service';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css'],
})
export class TipComponent {

  /// CONSTRUCTEUR
  // Initialisation des différents services : TipsService, CommentsService, TokenService, FeedbackService, ActivatedRoute
  constructor(public tipsService : TipsService, 
    private commentsService : CommentsService, 
    public tokenService : TokenService, 
    private feedbackService : FeedbackService,
    private activatedRoute : ActivatedRoute){}

  /// METHODES
  // A l'initialisation de la page
  // Récupération de l'identifiant de l'astuce sélectionnée
  ngOnInit() : void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.currentTip.id = params['tipID'];
      this.updateTip();
    });
  }

  // Fonction d'ajout de commentaire
  // Met à jour la liste des commentaires après ajout du commentaire
  // Feedback pour l'utilisateur
  addComment() : void {
    this.commentsService.addComment(this.tokenService.getToken(), {text: this.tipComment, id_tip: this.currentTip.id}).subscribe((response) => {
      this.updateCommentList();
      this.feedbackService.sendFeedback('Commentaire ajouté');
    });
  }

  // Fonction de mise à jour d'astuce
  // Récupère les informations de l'astuce dans la base de données, et met à jour la liste des commentaires
  private updateTip() : void {
    this.tipsService.getTip(this.currentTip.id).subscribe((response) =>{
      this.currentTip = response;
      if (!this.currentTip.tipPicture) this.currentTip.tipPicture = '../../assets/placeholder.jpg';
      this.updateCommentList();
      this.tipComment = '';
    });
  }

  // Fonction de mise à jour de la liste des commentaires
  // Récupère l'ensemble des commentaires de l'astuce sélectionnée
  private updateCommentList() : void {
    this.commentsService.getTipComments(this.currentTip.id).subscribe((response) => {
      this.tipComment = '';
      this.comments = response;
    });
  }
  
  // Fonction de suppression d'un commentaire
  // Prend en paramètres l'identifiant du commentaire, l'auteur du commentaire, et l'état administrateur de l'utilisateur demandant la suppression du commentaire
  deleteComment(commentAuthor : string, commentID : number, isAdmin : boolean) : void {
    let response = confirm(`Supprimer ${(isAdmin) ? `le commentaire de ${commentAuthor}` : 'votre commentaire'} ?`);
    if (response) {
      this.feedbackService.sendFeedback(`Suppression ${(isAdmin) ? `du commentaire de ${commentAuthor}` : 'de votre commentaire'}`);
      var deleteCommentResponse = (isAdmin) ? 
      this.commentsService.deleteAdminComment(this.tokenService.getToken(), commentID) : 
      this.commentsService.deleteUserComment(this.tokenService.getToken(), commentID);
      deleteCommentResponse.subscribe((response) =>{
        this.updateCommentList();
      });
    }
  }

  // Fonction d'upload d'image
  // Garde en mémoire l'image sélectionnée à l'aide de l'ajout de fichier
  setTipPicture(event : any) : void {
    this.tempPictureFile = event.target.files[0];
  }

  // Fonction d'activation du mode d'édition de l'astuce
  // Accessible uniquement à l'auteur de l'astuce
  beginEditing() : void {
    this.isEditing = true;

    this.editTip = this.currentTip;
    this.editTags = this.editTip.tags.split(',');
  }

  // Fonction de validation des choix lors de l'édition
  // Accessible uniquement à l'auteur de l'astuce
  validateEditing() : void {
    this.isEditing = false;

    const formData = new FormData();
    formData.append("id", this.editTip.id.toString());
    formData.append("title", this.editTip.title);
    formData.append("subjectDescription", this.editTip.subjectDescription);
    formData.append("tipDescription", this.editTip.tipDescription);
    formData.append("tags", this.editTags.toString());
    if (this.tempPictureFile) formData.append("file", this.tempPictureFile);

    this.tipsService.updateUserTip(this.tokenService.getToken(), formData).subscribe((response) => {
      this.feedbackService.sendFeedback(`Astuce ${this.editTip.title} modifiée`);
      this.updateTip();
    });
  }

  // Fonction d'annulation du mode d'édition
  // Accessible uniquement à l'auteur de l'astuce
  cancelEditing() : void {
    this.isEditing = false;
  }

  /// PARAMETRES
  // Astuce courante
  currentTip: Tip = new Tip();
  
  // Variables du mode d'édition
  isEditing : boolean = false;
  editTip: Tip = new Tip();
  editTags: string[] = [];
  tempPictureFile!: File;
  
  // Variables liées aux commentaires
  tipComment: string = '';
  comments: Comment[] = [];
}

