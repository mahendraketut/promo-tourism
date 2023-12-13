import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-merchant',
  templateUrl: './sidenav-merchant.component.html',
  styleUrls: ['./sidenav-merchant.component.css'],
})
export class SidenavMerchantComponent {
  logo: any;

  constructor() {
    this.logo = 'assets/images/logo.png';
  }
}
