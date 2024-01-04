import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environment';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent {
  coverPreviews: { url: string; fileName: string }[] = [];
  imagePreviews: { url: string; fileName: string }[] = [];
  productForm: FormGroup;
  productImages: File[] = [];
  coverImage: File | null = null;
  tinyAPI: string = environment.tinyMCEAPI;

  constructor(
    private productService: ProductService,
    private tokenService: TokenService
  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      //PRODUCT STOCK IS PRODUCT QUANTITY
      quantity: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }

  //This will be triggered if the user inserted a product cover image.
  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input.files && input.files.length) {
      this.coverImage = input.files[0];
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

//This will be triggered if the user inserted the product images.
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input.files) {
      this.productImages = Array.from(input.files);
      this.imagePreviews = []; // Clear existing previews

      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        const fileName = selectedFile.name;
        const reader = new FileReader();
        reader.onload = () => {
          const previewURL = reader.result as string;
          this.imagePreviews.push({ url: previewURL, fileName });
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  }

  //onSubmit function
  //This will be triggered if the user clicks the submit button.
  //The products information will be inserted into a form data.
  //Then, the form data will be sent to the backend using product service.
  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      const userId = this.tokenService.getUserId();

      //Append product details to the formdata.
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('quantity', this.productForm.get('quantity').value);
      formData.append('category', this.productForm.get('category').value);
      formData.append('owner', userId);

      //Append cover image to the formdata.
      if (this.coverImage) {
        formData.append('cover', this.coverImage, this.coverImage.name);
      }

      //Append product images to the formdata.
      this.productImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file, file.name);
      });

    //Forward the form data to the product service.
      this.productService.addProduct(formData).subscribe({
        next: () => {
          Swal.fire('Success!', 'Your product has been added.', 'success');
        },
        error: (error) => {
          console.error('err:', error);
          Swal.fire('Error!', 'Your product has not been added.', 'error');
        },
      });
    }
  }

  //Displays file details
  showFileDetails(file: File): void {
    console.log(
      `Selected File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`
    );
  }

  //Method to parse the file name from the params url.
  getFileNameFromURL(url: string): string {
    // Extract file name from URL
    const startIndex = url.lastIndexOf('/') + 1;
    const endIndex =
      url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.length;
    return url.substring(startIndex, endIndex);
  }

  //Method to parse the file size from the params url.
  //converts it to KB
  getFileSizeFromURL(url: string): string {
    const sizeInBytes = url.length * 0.75; 
    const sizeInKb = sizeInBytes / 1024;
    return `${sizeInKb.toFixed(2)} KB`;
  }

  //Reset images if the user clicks the clear button.
  resetImagePreviews(): void {
    this.imagePreviews = [];
    this.coverPreviews = [];
  }
}
