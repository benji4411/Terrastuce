import { Component } from '@angular/core';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  /// CONSTRUCTEUR
  // Initialisation des différents services : TokenService
  constructor(public tokenService : TokenService){}
}
