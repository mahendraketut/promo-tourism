import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() rating: number = 0;
  @Input() price: number = 0;
  @Input() id: string = '';
  @Input() route: string = '';

  constructor(private router: Router) {}

  navigateToProductDetail(productId: string): void {
    const baseProductUrl = '/detailproduct/';

    // Update the browser's URL without adding to history
    window.history.pushState({}, '', baseProductUrl);

    // Navigate to the full path without adding to history
    this.router.navigate([baseProductUrl + productId], {
      skipLocationChange: false,
    });
    console.log('id', this.id);
  }
}
