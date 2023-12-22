import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/app/environment';
import { NavigationExtras, Route, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: any = [];
  coverImage: { url: string; fileName: string }[] = [];
  //A form to contain products
  fileName = '';
  productForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.readProduct();
    //form builder
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      discount: [''],
      category: [''],
      images: [null], // To handle multiple images (FileList)
    });
  }
  ngOnInit() {}
  //Gets all products from the product service.

  readProduct() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log('data: ', data);
    });
  }

  readCoverImageURL(coverImagePath: string): string {
    return environment.productImgUrl + '/' + coverImagePath;
  }

  //Deletes a product using the product service.
  deleteProduct(product, index) {
    if (window.confirm('Are you sure?')) {
      this.productService.deleteProduct(product._id).subscribe((data) => {
        this.products.splice(index, 1);
      });
    }
  }
}
