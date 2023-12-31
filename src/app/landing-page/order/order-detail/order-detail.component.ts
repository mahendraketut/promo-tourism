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
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private productService: ProductService,
    private analyticsService: AnalyticsService
  ) {

    console.log("analytics ALL:", this.analyticsService.getAllAnalytics(2023).subscribe((data: any) => {
      console.log("analytics all: ", data);
    }
    ));
    console.log("analytics by id: ", this.analyticsService.getMerchantAnalytics("657c6d585e0bf763f2f542ff", 2023).subscribe((data: any) => {
      console.log("analytics by id: ", data);
    }
    ));
    //Retireve data from order service
    // this.isReviewed = orderService.hasReviewed(this.orderId);
    console.log('REVIEW status: ', orderService.hasReviewed(this.orderId));

    // this.getReviewedStatus();
    console.log('stat bawah hasreview: ', this.hasReviewed);
    // this.reviewService
    //   .getMerchantAverage('657c6d585e0bf763f2f542ff')
    //   .subscribe((data: any) => {
    //     console.log('Merchant average: ', data);
    //   });
    this.getOrderDetails();
  }

  //Retreive data if the user has reviewed the order previously.
  // getReviewedStatus() {
  //   this.orderService.hasReviewed(this.orderId).subscribe((data: any) => {
  //     console.log('data review status: ', data);
  //     this.hasReviewed = data.data;
  //   });
  // }

  //TODO: tut, order detailnya tolong di transplantasi kak
  getOrderDetails() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log('order id: ', this.orderId);
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response) => {
        console.log('Response: ', response);
        this.orderData = response.data;
        this.productId = response.data.productId;
        this.buyerId = response.data.userId;
        this.merchantId = response.data.merchantId;
        this.hasReviewed = response.data.hasReviewed;
        console.log('Order data: ', this.orderData);
        this.getBuyerDetails(response.data.userId);
        this.getMerchantDetail(response.data.merchantId);
        this.getProductDetail(response.data.productId);
        this.getReviewData(response.data._id);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // get buyer details
  getBuyerDetails(id: string) {
    // TODO need method getUserById

    this.authService.getUserDataById(id).subscribe({
      next: (response) => {
        this.buyerData = response.merchant;
        console.log('Buyer data: ', this.buyerData);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // get merchant detail
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

  // get product detail
  getProductDetail(id: string) {
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.productData = response.data;
        console.log('Product data: ', this.productData);
        this.productImage = `${environment.productImgUrl}/${this.productData.coverImagePath}`;
        console.log('Product image: ', this.productImage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getReviewData(id: string) {
    this.reviewService.getReviewByOrder(id).subscribe({
      next: (response) => {
        this.reviewData = response.data;
        this.rating = response.data.rating;
        console.log('Review data: ', this.reviewData);
        console.log('Review rating: ', this.rating);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  exportToPdf() {
    const getElementById = 'invoice';
    const fileName = this.orderData.invoiceNumber;
    this.pdfService.exportToPdf(getElementById, fileName);
  }

  // scroll smoothly to object Id that targeted in button
  smoothScroll(elementId: string): void {
    let scroll = document.getElementById(elementId);
    scroll?.scrollIntoView({ behavior: 'smooth' });
  }

  setRating(rating: number): void {
    this.value = rating;
    this.valueChange.emit(this.value);
    console.log('current rating given: ' + this.value);
  }

  onCommentChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.userComment = target.value;
  }

  // submit review
  submitReview(): void {
    console.log('prodak id: ', this.productId);
    if (this.value == null || this.value == undefined || this.value == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please give a rating!',
      });
    }
    try {
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
