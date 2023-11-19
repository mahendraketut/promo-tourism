import { Component } from '@angular/core';

@Component({
  selector: 'app-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['./officer.component.css'],
})
export class OfficerComponent {
  image: any = 'assets/img/imagecover.jpg';
  tourismMalaysiaLogo: any = 'assets/img/tourismMalaysia.png';
  promoTourismLogo: any = 'assets/img/logo-landscape.png';
  userRole: any = 'officer';
}
