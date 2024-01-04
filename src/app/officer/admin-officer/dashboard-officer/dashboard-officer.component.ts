import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
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
    private productService: ProductService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.name = decodedToken.name;
    } else {
      console.log('Token is not valid or not present');
    }
    this.getUser();
    this.getMerchant();
    this.getProduct();
  }

  // method to get numbers of user from services
  getUser() {
    this.authService.getNumberOfUsers().subscribe((res) => {
      this.user = res.data;
    });
  }

  // method to get numbers of merchant from services
  getMerchant() {
    this.authService.getNumberOfMerchants().subscribe((res) => {
      this.merchant = res.data;
    });
  }

  // method to get numbers of product from services
  getProduct() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.product = res.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
