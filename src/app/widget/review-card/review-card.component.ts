import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css'],
})
export class ReviewCardComponent {
  logoMerchant: any = 'assets/img/avatar.png';
  rating: number = 0;
  comment: string = '';
  reviewData: any;
  userData: any;
  @Input() reviewId = '';

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getReview(this.reviewId);
  }

  getReview(id: string) {
    this.reviewService.getReviewbyId(id).subscribe({
      next: (response) => {
        this.reviewData = response.data;
        this.rating = this.reviewData.rating;
        this.comment = this.reviewData.comment;
        this.getUser(this.reviewData.userId);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getUser(id: string) {
    this.authService.getUserDataById(id).subscribe({
      next: (response) => {
        this.userData = response.merchant;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
