import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-officer',
  templateUrl: './sidenav-officer.component.html',
  styleUrls: ['./sidenav-officer.component.css'],
})
export class SidenavOfficerComponent {
  sidenavOpen: boolean = true;

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
