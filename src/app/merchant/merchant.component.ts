import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css'],
})
export class MerchantComponent {
  image: any = 'assets/img/imagecover.jpg';
  tourismMalaysiaLogo: any = 'assets/img/tourismMalaysia.png';
  promoTourismLogo: any = 'assets/img/logo-landscape.png';
  userRole: string | null = null;
  name: string = 'John Doe';

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.userRole = decodedToken.roles;
      this.name = decodedToken.name;
    } else {
      console.error('Failed to decode token')
    }
  }
}
