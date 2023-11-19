import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-officer',
  templateUrl: './navbar-officer.component.html',
  styleUrls: ['./navbar-officer.component.css'],
})
export class NavbarOfficerComponent {
  dropdownOpen: boolean = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
