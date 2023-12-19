import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-merchant-review',
  templateUrl: './merchant-review.component.html',
  styleUrls: ['./merchant-review.component.css'],
})
export class MerchantReviewComponent implements OnInit {
  dtOptions: any = {};
  merchants: any[] = [];
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthMenu: [5, 15, 5, 5, 5, 10, 10],
      responsive: true,
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel', 'pdf'],
    };
    this.fetchMerchants();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  fetchMerchants() {
    this.authService.getMerchants().subscribe({
      next: (data) => {
        //this enters the merchants data into our local array.
        this.merchants = data;
        this.dtTrigger.next(null as any);
      },
      error: (error) => {
        console.error('Error fetching merchants:', error);
      },
      complete: () => {
        console.log('Merchant data retrieval complete.');
      }
    });
  }


  acceptMerchant(merchantId: string) {
    this.authService.acceptMerchant(merchantId).subscribe({
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
      }
    });
  }

  rejectMerchant(merchantId: string) {
    this.authService.rejectMerchant(merchantId).subscribe({
      next: (response) => {
        console.log('Merchant rejected:', response);
      },
      error: (error) => {
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
          // Reload the page
          window.location.reload();
        });
      }
    });
  }
}

