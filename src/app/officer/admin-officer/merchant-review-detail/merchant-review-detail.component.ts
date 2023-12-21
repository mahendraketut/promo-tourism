import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/app/environment';


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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.merchantId = this.route.snapshot.paramMap.get('id');
    console.log(this.merchantId);
    // this.authService.getMerchant(this.merchantId).subscribe({
    //   next: (data) => {
    //     this.merchantData = data;
    //     console.log('Merchant data:', this.merchantData);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching merchant:', error);
    //   },
    //   complete: () => {
    //     console.log('Merchant data retrieval complete.');
    //   },
    // });
    this.authService.getMerchantById(this.merchantId).subscribe({
      next: (data) => {
        this.merchantData = data;
        console.log('Merchant data:', this.merchantData);
        this.retreiveMerchantPdf();
      },
      error: (error) => {
        console.error('Error fetching merchant:', error);
      },
      complete: () => {
        console.log('Merchant data retrieval complete.');
      },
    });

  }

  retreiveMerchantPdf(){


    this.licensePdfUrl = environment.merchantPdfUrl + '/' + this.merchantData?.merchant?.licensePath;
    this.reviewsPdfUrl = environment.merchantPdfUrl + '/' + this.merchantData?.merchant?.reviewsPath;

    console.log("license pdf url:", this.licensePdfUrl);
    console.log("reviews pdf url:", this.reviewsPdfUrl);
  }
}
