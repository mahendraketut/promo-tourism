import { Component } from '@angular/core';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css'],
})
export class MerchantComponent {
  image: any = 'assets/img/imagecover.jpg';
  tourismMalaysiaLogo: any = 'assets/img/tourismMalaysia.png';
  promoTourismLogo: any = 'assets/img/logo-landscape.png';
  userRole: any = 'merchant';
}
