
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  
  products:any = [];
  //A form to contain products
  fileName = '';
  productForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService) { 
    this.readProduct();
    //form builder
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      discount: [''],
      category: [''],
      images: [null] // To handle multiple images (FileList)
    });
  }
  ngOnInit() {}
  //Gets all products from the product service.
  readProduct(){
    this.productService.getProducts().subscribe((data) => {
        this.products = data;
        console.log("data: ",data);
    });
}
  //Deletes a product using the product service.
  deleteProduct(product, index) {
    if(window.confirm('Are you sure?')) {
        this.productService.deleteProduct(product._id).subscribe((data) => {
          this.products.splice(index, 1);
        }
      )    
    }
  }


  // onSubmit() {
  //   const formData = new FormData();
  //   const imagesInput = this.productForm.get('images');
  
  //   if (imagesInput && imagesInput.value) {
  //     const files: File[] = Array.from(imagesInput.value);
  //     if (files) {
  //       for (let i = 0; i < files.length; i++) {
  //         formData.append('images', files[i]);
  //       }
  //     }
  //   }
  
  //   // Append other form values to FormData
  //   Object.keys(this.productForm.value).forEach(key => {
  //     if (key !== 'images') {
  //       formData.append(key, this.productForm.get(key).value);
  //     }
  //   });
  //   console.log("sampe bawah");
  //   console.log("fd:",formData);
  //   this.productService.createProduct(formData).subscribe({
  //     next: (response) => {
  //       console.log('Product created successfully!', response);
  //       // Handle success, reset the form, etc.
  //       this.productForm.reset();
  //     },
  //     error: (error) => {
  //       console.error('Error creating product:', error);
  //       // Handle error
  //     }
  //   });
  // }


  onSubmit() {
    const formData = new FormData();
    const file:File[] = event.target.files;
    const imagesInput = this.productForm.get('images');
  
    if (imagesInput && imagesInput.value) {
      const files: File[] = Array.from(imagesInput.value);
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      }
    }
  
    
    this.productService.createProduct(formData, imagesInput).subscribe({
      next: (response) => {
        console.log('Product created successfully!', response);
        // Handle success, reset the form, etc.
        this.productForm.reset();
      },
      error: (error) => {
        console.error('Error creating product:', error);
        // Handle error
      }
    });
  }


  // onSubmit() {
  //   const formData = new FormData();
  //   const imagesInput = this.productForm.get('images');
  
  //   if (imagesInput && imagesInput.value) {
  //     const files: File[] = imagesInput.value;
  //     if (files) {
  //       for (let i = 0; i < files.length; i++) {
  //         formData.append('images', files[i]);
  //       }
  //     }
  //   }
  
  //   // Append other form values to FormData
  //   Object.keys(this.productForm.value).forEach(key => {
  //     if (key !== 'images') {
  //       formData.append(key, this.productForm.get(key).value);
  //     }
  //   });
  
  //   this.productService.createProduct(formData).subscribe({
  //     next: (response) => {
  //       console.log('Product created successfully!', response);
  //       // Handle success, reset the form, etc.
  //       this.productForm.reset();
  //     },
  //     error: (error) => {
  //       console.error('Error creating product:', error);
  //       // Handle error
  //     }
  //   });
  // }


}

