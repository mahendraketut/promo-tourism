import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-merchant-review',
  templateUrl: './merchant-review.component.html',
  styleUrls: ['./merchant-review.component.css'],
})
export class MerchantReviewComponent implements OnInit {
  dtOptions: any = {};
  merchants: any[] = [];

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

  fetchMerchants() {
    this.authService.getMerchants().subscribe({
      next: (data) => {
        //this enters the merchants data into our local array.
        this.merchants = data;
      },
      error: (error) => {
        console.error('Error fetching merchants:', error);
      },
      complete: () => {
        console.log('Merchant data retrieval complete.');
      }
    });
  }


  // acceptMerchant(merchantId: string) {
  //   this.authService.acceptMerchant(merchantId).subscribe({
  //     next: (response) => {
  //       console.log('Merchant accepted:', response);
  //     },
  //     error: (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Something went wrong!',
  //       });
  //     },
  //     complete: () => {
  //       console.log('Accepting merchant complete.');
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Merchant accepted!',
  //         text: 'Merchant has been accepted.',
  //       }).then(() => {
  //         // Reload the page
  //         window.location.reload();
  //       });
  //     }
  //   });
  // }

  // rejectMerchant(merchantId: string) {
  //   this.authService.rejectMerchant(merchantId).subscribe({
  //     next: (response) => {
  //       console.log('Merchant rejected:', response);
  //     },
  //     error: (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Something went wrong!',
  //       });
  //     },
  //     complete: () => {
  //       console.log('Rejecting merchant complete.');
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Merchant rejected!',
  //         text: 'Merchant has been rejected.',
  //       }).then(() => {
  //         // Reload the page
  //         window.location.reload();
  //       });
  //     }
  //   });
  // }



  acceptMerchant(merchantId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to accept this merchant?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.acceptMerchant(merchantId).subscribe({
          next: (response) => {
            console.log('Merchant accepted:', response);
            Swal.fire(
              'Accepted!',
              'The merchant has been accepted.',
              'success'
            ).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        });
      }
    });
  }
  
  rejectMerchant(merchantId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reject this merchant?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.rejectMerchant(merchantId).subscribe({
          next: (response) => {
            console.log('Merchant rejected:', response);
            Swal.fire(
              'Rejected!',
              'The merchant has been rejected.',
              'success'
            ).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        });
      }
    });
  }
  
}
