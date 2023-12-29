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
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';
import { TokenService } from 'src/app/services/token.service';

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
  userComment: string = 'Ini komen buat ngetest';
  orderId: string = '658a995f9ab604a16c1868e9';
  productId: string = '';

  constructor(
    private pdfService: PdfService,
    private reviewService: ReviewService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {
    //Retireve data from order service
    // this.isReviewed = orderService.hasReviewed(this.orderId);
    console.log('REVIEW status: ', orderService.hasReviewed(this.orderId));
    this.getOrderDetails();
  }

  //TODO: tut, order detailnya tolong di transplantasi kak
  getOrderDetails() {
    this.orderService.getOrderById(this.orderId).subscribe((data: any) => {
      console.log('getOrderById: ', data);
      this.dateOrder = data.data.createdAt;
      this.invoiceName = data.data.invoiceNumber;
      this.hasReviewed = data.data.hasReviewed;
      this.productId = data.data.productId;
      console.log('hasReviewed: ', this.hasReviewed);
      console.log('productId: ', this.productId);
      console.log('dateOrder: ', this.dateOrder);
      console.log('invoiceName: ', this.invoiceName);
    });
  }
  exportToPdf() {
    const getElementById = 'invoice';
    const fileName = this.invoiceName;
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
