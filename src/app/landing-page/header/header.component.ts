import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  // it will be called later. See header.component.html
  logoImage: any;
  logoSquare: any;
  urlLogo: any;
  isSearchBarEnable: boolean;

  constructor() {
    this.logoImage = '/assets/img/logo-landscape.png';
    this.logoSquare = 'assets/img/favicon.png';
    this.urlLogo = '';
    this.isSearchBarEnable = false;
  }
}
