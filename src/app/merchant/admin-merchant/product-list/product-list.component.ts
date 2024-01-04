import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { NavigationExtras, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  dtOptions: any = {};
  products: any = [];

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private tokenService: TokenService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      responsive: true,
      dom: 'Blfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'pdf',
        {
          text: 'New Product',
          key: '1',
          className:
            'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
          action: (e, dt, node, config) => {
            this.router.navigate(['/merchant/add-product']);
          },
        },
      ],
    };
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  fetchProducts() {
    const merchantId = this.tokenService.getUserId();
    this.productService.getProductsByMerchantId(merchantId).subscribe(
      (productsArray) => {
        this.products = productsArray;
        //push the average rating of the product based on the productsArray._id inside each index of products array
        this.products.forEach((data: any) => {
          this.reviewService.getReviewAverage(data._id).subscribe({
            next: (averageRating) => {
              if (averageRating.data)
                data.averageRating = Math.round(averageRating.data);
              else data.averageRating = 0;
            },
            error: (error) => {
              console.error('Error fetching average rating:', error);
            },
            complete: () => {
              console.log('Average rating retrieval complete.');
            },
          });
        });
        this.dtTrigger.next(undefined); // Trigger the DataTables to update
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  onUpdate(productId: string) {
    this.router.navigate(['/merchant/product/update', productId]);
  }

  navigateWithoutParams(route: string, id: string) {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true,
    };

    this.router.navigate([route, id], navigationExtras);
  }

  onDelete(productId: string) {
    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes', proceed with deletion
        this.productService.deleteProduct(productId).subscribe({
          next: (response) => {
            this.ngOnDestroy();
            this.ngOnInit(); // Refresh or better update the local data array
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
          },
          error: (error) => {
            // Handle error scenario
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting your product.',
              'error'
            );
          },
        });
      }
      // If 'Cancel' is clicked, do nothing
    });
  }
}
