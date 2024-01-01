import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() rating: number = 0;
  @Input() price: number = 0;
  @Input() id: string = '';
  @Input() route: string = '';

  constructor(private router: Router, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.getRating();
  }

  navigateToProductDetail(productId: string): void {
    const baseProductUrl = '/detailproduct/';

    // Update the browser's URL without adding to history
    window.history.pushState({}, '', baseProductUrl);

    // Navigate to the full path without adding to history
    this.router.navigate([baseProductUrl + productId], {
      skipLocationChange: false,
    });
  }

  getRating() {
    this.reviewService.getReviewAverage(this.id).subscribe({
      next: (data) => {
        if (!data.data) {
          this.rating = 0;
        } else {
          this.rating = Math.round(data.data);
        }
      },
      error: (error) => console.error('There was an error!', error),
    });
  }
}
