import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/app/environment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merchant-review-detail',
  templateUrl: './merchant-review-detail.component.html',
  styleUrls: ['./merchant-review-detail.component.css'],
})
export class MerchantReviewDetailComponent {
  merchantId: string;
  merchantData: any;
  licensePdfUrl: string;
  reviewsPdfUrl: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.merchantId = this.route.snapshot.paramMap.get('id');
    console.log(this.merchantId);
    this.authService.getMerchantById(this.merchantId).subscribe({
      next: (data) => {
        this.merchantData = data;
        console.log('Merchant data:', this.merchantData);
        this.retreiveMerchantPdf();
      },
      error: (error) => {
        console.error('Error getting merchant data:', error);
      },
    });
  }

  retreiveMerchantPdf() {
    this.licensePdfUrl =
      environment.merchantPdfUrl +
      '/' +
      this.merchantData?.merchant?.licensePath;
    this.reviewsPdfUrl =
      environment.merchantPdfUrl +
      '/' +
      this.merchantData?.merchant?.reviewsPath;

    console.log('license pdf url:', this.licensePdfUrl);
    console.log('reviews pdf url:', this.reviewsPdfUrl);
  }

  //Retrieve file size by getting file from licensePdfUrl and calculate the size. if size < 1 MB return as KB and vice versa.
  getFileSize(url: string) {
    let fileSize = 0;
    let xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send(null);
    if (xhr.status === 200) {
      fileSize = parseInt(xhr.getResponseHeader('Content-Length'));
    }
    console.log('fileSize:', fileSize);
    if (fileSize > 1000000) {
      return (fileSize / 1000000).toFixed(2) + ' MB';
    } else {
      return (fileSize / 1000).toFixed(2) + ' KB';
    }
  }

  //accept the merchant
  acceptMerchant() {
    this.authService.acceptMerchant(this.merchantId).subscribe({
      next: (response) => {
        console.log('Merchant accepted:', response);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      },
      complete: () => {
        console.log('Accepting merchant complete.');
        Swal.fire({
          icon: 'success',
          title: 'Merchant accepted!',
          text: 'Merchant has been accepted.',
        }).then(() => {
          // Reload the page
          window.location.reload();
        });
      },
    });
  }

  //reject the merchant
  rejectMerchant() {
    this.authService.rejectMerchant(this.merchantId).subscribe({
      next: (response) => {
        console.log('Merchant rejected:', response);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      },
      complete: () => {
        console.log('Rejecting merchant complete.');
        Swal.fire({
          icon: 'success',
          title: 'Merchant rejected!',
          text: 'Merchant has been rejected.',
        }).then(() => {
          //Reload the page
          window.location.reload();
        });
      },
    });
  }
}
