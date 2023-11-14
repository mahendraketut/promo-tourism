import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  isCartEnable: boolean;
  isShown: boolean;

  constructor(private router: Router) {
    this.logoImage = '/assets/img/logo-landscape.png';
    this.logoSquare = 'assets/img/favicon.png';
    this.urlLogo = '';
    this.isSearchBarEnable = false;
    this.isCartEnable = false;
    this.isShown = false;
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }
  // function goToRegister that will used to route
  goToRegister() {
    this.router.navigate(['auth/register']);
  }

  toggleMobileNav() {
    this.isShown = !this.isShown;
  }
}
