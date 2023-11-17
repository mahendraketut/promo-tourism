import { Component } from '@angular/core';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css'],
})
export class DetailProductComponent {
  image: any = 'assets/img/imagecover2.jpg';
  title: string = 'Tour to Kuala Lumpur City Center (KLCC)';
  rating: number = 5;
  purchases: number = 999;
  price: number = 1000;
  discount: number = 250;
  description: any = 'lorem ipsum';
  stock: number = 3;
  logoMerchant: any = 'assets/img/avatar.png';

  //purchasing data
  quantity: number = 0;
  isFull: boolean = false;

  //function increment()
  increment() {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  isAvailable() {
    if (this.quantity == this.stock) this.isFull = true;
    else this.isFull = false;
  }

  //function decrement()
  decrement() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
}
