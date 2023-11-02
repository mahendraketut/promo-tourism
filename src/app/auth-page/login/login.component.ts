import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  logo: any;

  constructor() {
    this.logo = '/assets/img/logo-landscape.png';
  }
}
