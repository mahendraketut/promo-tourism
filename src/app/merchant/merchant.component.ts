import { Component } from '@angular/core';
import { TokenService } from '../token.service';

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
      console.log(decodedToken); // Log the decoded token

      if (this.userRole === 'merchant') {
        console.log('merchant boss');
        this.userRole = 'merchant';
      } else {
        console.log('sing merchant ne');
      }
    } else {
      console.log('Token is not valid or not present');
      // Handle the situation when the token is not available or valid
      // Redirect to login or show error message
    }
  }
}
