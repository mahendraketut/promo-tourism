import { Component } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  //date and time now
  today: number = Date.now();
  name: string = 'John Doe';
  averageMerchantRate: number = 0;
  order: number = 0;
  product: number = 0;
  transaction: number = 0;

  constructor(
    private tokenService: TokenService,
    private reviewService: ReviewService,
    private productService: ProductService,
    private orderService: OrderService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.name = decodedToken.name;
    } else {
      console.log('Token is not valid or not present');
    }
    this.getAverageMerchantRate(decodedToken.id);
    this.getProduct(decodedToken.id);
    this.getOrder(decodedToken.id);
  }

  // method to get total product based on merchant
  getProduct(id: string) {
    this.productService.getProductsByMerchantId(id).subscribe({
      next: (res) => {
        this.product = res.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // method to get total order based on merchant
  getOrder(id: string) {
    this.orderService.getOrderByMerchantId(id).subscribe({
      next: (res) => {
        this.order = res.data.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // method to get overall merchant rating
  getAverageMerchantRate(mid: string) {
    this.reviewService.getMerchantAverage(mid).subscribe({
      next: (res) => {
        this.averageMerchantRate = Math.round(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // method to get total transaction
}
