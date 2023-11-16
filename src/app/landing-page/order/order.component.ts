import { Component } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  dateOrder: Date = new Date(2023, 7, 17);
  total: any = 17000;
  image: any = 'assets/img/imagecover.jpg';
}
