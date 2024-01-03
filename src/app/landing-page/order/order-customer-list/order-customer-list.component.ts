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
    private tokenService: TokenService,
    private orderService: OrderService
  ) {}

  //Retreive user data and orders on init.
  ngOnInit(): void {
    this.getUserData();
    this.getOrders();
  }

  //Function to get user data from token.
  getUserData() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken)
      if (decodedToken) {
        this.userData = decodedToken;
      } else {
        console.error('Error decoding token');
      }
  }

  //Function to get orders by user id.
  getOrders() {
    this.orderService.getOrderByUserId(this.userData.id).subscribe({
      next: (response) => {
        //Sort the orders so the newest are displayed first.
        this.orders = response.status.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          //Validate the dates
          if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            //If both are valid dates, compare them.
            return dateB.getTime() - dateA.getTime();
          } else {
            //If one or both are invalid dates, return 0.
            return 0;
          }
        });
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}