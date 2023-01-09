import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  /// CONSTRUCTEUR
  // Initialisation du MatSnackBar
  constructor(private matSnackBar : MatSnackBar) { }

  /// METHODES
  // Fonction d'affichage de feedback
  // Prend en paramètre un message qui sera affiché via MatSnackBar, en bas au milieu de l'écran
  sendFeedback(feebackText: string) : void {
    this.matSnackBar.open(feebackText, 'Fermer', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  /// PARAMETRES
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';
}
