import { Component } from '@angular/core';

@Component({
  selector: 'not-found',
  template: `
    <div class="main">
      <br />
      <br />
      <h2>404</h2>
      <p>
        Cette page n'existe pas
        <button mat-button routerLink="" color="accent">
          Revenir à l'accueil
        </button>
      </p>
    </div>
  `,
  styles: [],
})
export class NotFoundComponent {}
