import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  logo: any;

  constructor() {
    this.logo = '/assets/img/logo-landscape.png';
  }
}
