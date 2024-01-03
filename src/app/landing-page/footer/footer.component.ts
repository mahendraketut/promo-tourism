import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  logoFooter: any;
  year: any;
  companyName: any;
  //Retreive the logo, year and company name.
  constructor() {
    this.logoFooter = 'assets/img/logo-landscape.png';
    this.year = new Date().getFullYear();
    this.companyName = 'Promo Tourism Sdn. Bhd';
  }
}
