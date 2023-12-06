import { Component, Input } from '@angular/core';

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

  @Input() route: string = '';

  constructor() {}
}
