import { Component } from '@angular/core';

@Component({
  selector: 'app-order-customer-list',
  templateUrl: './order-customer-list.component.html',
  styleUrls: ['./order-customer-list.component.css'],
})
export class OrderCustomerListComponent {
  dateOrder: Date = new Date(2023, 7, 17);
  total: any = 17000;
  image: any = 'assets/img/imagecover.jpg';
}
