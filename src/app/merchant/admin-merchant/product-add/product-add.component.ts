import { Component } from '@angular/core';
import { TempService } from 'src/app/temp.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent {
  coverPreviews: { url: string; fileName: string }[] = [];
  imagePreviews: { url: string; fileName: string }[] = [];
  productForm: FormGroup;

  constructor(private tempService: TempService) { 
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      //PRODUCT STOCK IS PRODUCT QUANTITY
      // productDiscount: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      productImages: new FormArray([]),
      productCovers: new FormArray([]),

    });
  }


  onCoverChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.coverPreviews = []; // Clear existing previews

      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        const fileName = selectedFile.name;

        // Read and display image preview
        const reader = new FileReader();
        reader.onload = () => {
          const previewURL = reader.result as string;
          this.coverPreviews.push({ url: previewURL, fileName });
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.imagePreviews = []; // Clear existing previews

      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        const fileName = selectedFile.name;

        // Read and display image preview
        const reader = new FileReader();
        reader.onload = () => {
          const previewURL = reader.result as string;
          this.imagePreviews.push({ url: previewURL, fileName });
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('form valid');
      const imagesArray = this.productForm.get('productImages') as FormArray;
      const coversArray = this.productForm.get('productCovers') as FormArray;
  
      // Clear existing form array values
      imagesArray.clear();
      coversArray.clear();
  
      // Add existing preview data to form arrays
      this.imagePreviews.forEach((preview) => {
        imagesArray.push(new FormControl(preview.url));
      });
  
      this.coverPreviews.forEach((preview) => {
        coversArray.push(new FormControl(preview.url));
      });
  
      const productData = this.productForm.value;
  
      // Now you can work with the product data or pass it to the service
      console.log("prod data: ", productData);
      const isAdded = this.tempService.addProduct(productData);
      if(isAdded){
        Swal.fire(
          'Success!',
          'Your product has been added.',
          'success'
        )

      }
      else{
        Swal.fire(
          'Error!',
          'Your product has not been added.',
          'error'
        )
      }
        

    }
  }
  

  showFileDetails(file: File): void {
    // Display file details as needed, e.g., file name, size, type
    console.log(
      `Selected File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`
    );
  }

  getFileNameFromURL(url: string): string {
    // Extract file name from URL
    const startIndex = url.lastIndexOf('/') + 1;
    const endIndex =
      url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.length;
    return url.substring(startIndex, endIndex);
  }

  getFileSizeFromURL(url: string): string {
    // Extract file size from URL
    const sizeInBytes = url.length * 0.75; // Approximate size calculation
    const sizeInKb = sizeInBytes / 1024;
    return `${sizeInKb.toFixed(2)} KB`;
  }

  // Method to reset image previews
  resetImagePreviews(): void {
    this.imagePreviews = [];
    this.coverPreviews = [];
  }

}
