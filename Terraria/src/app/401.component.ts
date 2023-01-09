import { Component } from '@angular/core';

@Component({
  selector: 'access-denied',
  template: `
    <div class="main">
      <br />
      <br />
      <h2>401</h2>
      <h3>Accès refusé</h3>
      <p>
        Vous n'avez pas les acréditations requises pour accèder à cette page
        <button mat-button routerLink="" color="accent">
          Revenir à l'accueil
        </button>
      </p>
    </div>
  `,
  styles: [],
})
export class AccessDeniedComponent {}
