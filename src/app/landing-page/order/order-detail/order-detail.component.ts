//TODO:HEN KOMEN NANTI
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PdfService } from 'src/app/services/pdf.service';
import { ReviewService } from 'src/app/services/review.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/app/environment';
import { ProductService } from 'src/app/services/product.service';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  @ViewChild('invoice', { static: false }) contentToConvert: ElementRef;
  @Input() value: number;
  @Output() valueChange = new EventEmitter<number>();

  dateOrder: any;
  hasReviewed: boolean = false;
  reviewForm: FormGroup<any>;
  invoiceName: string = '';
  //TODO: Tut, input user comment dari front-end
  //TODO: Tut, input order id dari front-end
  //TODO: Tut, tolong di disable orang comment kalau hasReviewed = true. (udah review)
  userComment: string = '';
  orderId: string = '';
  orderData: any;
  productId: string = '';
  productData: any;
  buyerId: string = '';
  buyerData: any;
  merchantId: string = '';
  merchantData: any;
  reviewData: any;
  productImage: any;
  rating: number = 5;

  constructor(
    private pdfService: PdfService,
    private reviewService: ReviewService,
    private orderService: OrderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private productService: ProductService,
  ) {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response) => {
        this.orderData = response.data;
        this.productId = response.data.productId;
        this.buyerId = response.data.userId;
        this.merchantId = response.data.merchantId;
        this.hasReviewed = response.data.hasReviewed;
        this.getBuyerDetails(response.data.userId);
        this.getMerchantDetail(response.data.merchantId);
        this.getProductDetail(response.data.productId);
        this.getReviewData(response.data._id);
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  //Retreive user data from backend
  getBuyerDetails(id: string) {
    // TODO need method getUserById

    this.authService.getUserDataById(id).subscribe({
      next: (response) => {
        this.buyerData = response.merchant;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  //Retreive merchant data from the backend.
  getMerchantDetail(id: string) {
    this.authService.getUserDataById(id).subscribe({
      next: (response) => {
        this.merchantData = response.merchant;
        console.log('Merchant data: ', this.merchantData);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  //Retreive product data from the backend.
  getProductDetail(id: string) {
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.productData = response.data;
        this.productImage = `${environment.productImgUrl}/${this.productData.coverImagePath}`;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  //Retreive review data from the backend.
  getReviewData(id: string) {
    this.reviewService.getReviewByOrder(id).subscribe({
      next: (response) => {
        this.reviewData = response.data;
        this.rating = response.data.rating;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  //Used to call the pdf service to generate the invoice.
  exportToPdf() {
    const getElementById = 'invoice';
    const fileName = this.orderData.invoiceNumber;
    this.pdfService.exportToPdf(getElementById, fileName);
  }

  //Used to add smooth scrolling within the page.
  smoothScroll(elementId: string): void {
    let scroll = document.getElementById(elementId);
    scroll?.scrollIntoView({ behavior: 'smooth' });
  }

  //Used to set the rating.
  setRating(rating: number): void {
    this.value = rating;
    this.valueChange.emit(this.value);
  }
  
  //Used to add a review comment.
  onCommentChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.userComment = target.value;
  }

  //Submit review to the backend.
  submitReview(): void {
    //Ensure that the user has given a rating.
    if (this.value == null || this.value == undefined || this.value == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please give a rating!',
      });
    }
    try {
      //Call the review service to create a review.
      this.reviewService
        .createReview({
          rating: this.value,
          comment: this.userComment,
          orderId: this.orderId,
          userId: this.tokenService.getUserId(),
          productId: this.productId,
        })
        .subscribe((data: any) => {
          console.log('createReview: ', data);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Thank you for your review!',
          });
          this.getOrderDetails();
        });
    } catch (error) {}
  }
}
