import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-order-customer-list',
  templateUrl: './order-customer-list.component.html',
  styleUrls: ['./order-customer-list.component.css'],
})
export class OrderCustomerListComponent implements OnInit {
  userData: any;
  orders: any;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getOrders();
  }

  getUserData() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken)
      if (decodedToken) {
        console.log(decodedToken); // Log the decoded token
        this.userData = decodedToken;
      } else {
        console.log('Token is not valid or not present');
      }
  }

  getOrders() {
    this.orderService.getOrderByUserId(this.userData.id).subscribe({
      next: (response) => {
        console.log('Response: ', response.status);

        // Assuming response.status is an array of orders
        this.orders = response.status.sort((a, b) => {
          // Parse createdAt into date objects and handle invalid dates
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          // Check if date conversion is successful
          if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            // Sort in descending order of createdAt
            return dateB.getTime() - dateA.getTime();
          } else {
            // Handle invalid date comparison, perhaps by not changing order
            return 0;
          }
        });

        console.log('Orders: ', this.orders);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
