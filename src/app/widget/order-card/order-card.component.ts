import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environment';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent implements OnInit {
  @Input() quantity: number;
  @Input() productId: number;
  @Input() total: number;
  @Input() dateOrder: any;
  @Input() invoiceId: string;
  @Input() status: string;
  @Input() description: any;
  @Input() link: any;
  imagePath: string;
  price: number;
  defaultDescription: string;
  title: string;
  route: any;

  constructor(private productService: ProductService, private router: Router) {
    this.route = '/order/detail/' + this.link;
  }

  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (response) => {
        this.price = response.data.price;
        this.imagePath =
          environment.productImgUrl + '/' + response.data.coverImagePath;
        this.defaultDescription = 'Category: ' + response.data.category;
        this.title = response.data.name;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  navigateToOrderDetail(orderId: string): void {
    const baseProductUrl = '/order/';

    // Update the browser's URL without adding to history
    window.history.pushState({}, '', baseProductUrl);

    // Navigate to the full path without adding to history
    this.router.navigate([baseProductUrl + orderId], {
      skipLocationChange: false,
    });
  }
}
