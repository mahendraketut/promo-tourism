import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-merchant',
  templateUrl: './navbar-merchant.component.html',
  styleUrls: ['./navbar-merchant.component.css'],
})
export class NavbarMerchantComponent {
  dropdownOpen: boolean = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
