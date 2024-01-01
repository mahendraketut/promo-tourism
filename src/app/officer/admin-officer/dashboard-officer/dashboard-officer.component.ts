import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-dashboard-officer',
  templateUrl: './dashboard-officer.component.html',
  styleUrls: ['./dashboard-officer.component.css'],
})
export class DashboardOfficerComponent {
  today: number = Date.now();
  name: string = 'John Doe';
  user: number = 0;
  merchant: number = 0;
  product: number = 0;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      console.log(decodedToken); // Log the decoded token
      this.name = decodedToken.name;
    } else {
      console.log('Token is not valid or not present');
      // Handle the situation when the token is not available or valid
      // Redirect to login or show error message
    }
  }
}
