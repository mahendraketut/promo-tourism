import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  dtOptions: any = {};
  products: any = [
  ];
  constructor(private productService:ProductService, private router: Router, private tokenService: TokenService) {
    this.products = this.productService.getProductsByMerchantId(this.tokenService.getUserId());
    console.log('all prod: ', this.products);
  }

  ngOnInit(): void {
    //the datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthMenu: [5, 15, 5, 5, 5, 10, 5],
      responsive: true,
      dom: 'Bfrtip',
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
    const merchantId = this.tokenService.getUserId();
    this.productService.getProductsByMerchantId(merchantId).subscribe(
      (productsArray) => {
        this.products = productsArray; // This should now be an array
        console.log('Products for merchant:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  // onDelete(productId:string){
  //   console.log("masuk ts prod id: ", productId);
  //   //TODO: tut, tolong tambah swal disini buat nge warning user yakin mau delete, ini gabisa rdi reverse
  //   this.productService.deleteProduct(productId).subscribe(
  //     (response) => {
  //       // console.log('Product deleted:', response);
  //       this.ngOnInit();
  //     },
  //     (error) => {
  //       console.error('Error deleting product:', error);
  //     }
  //   );
  // }

  onDelete(productId: string) {
    // Confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with deletion
        this.productService.deleteProduct(productId).subscribe({
          next: (response) => {
            console.log('Product deleted:', response);
            Swal.fire(
              'Deleted!',
              'Your product has been deleted.',
              'success'
            );
            this.ngOnInit(); // Or better, remove the item from the array instead of reloading
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting your product.',
              'error'
            );
          }
        });
      }
    });
  }
  

}
