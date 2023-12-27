import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/app/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/token.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent {
  coverPreviews: { url: string; fileName: string }[] = [];
  imagePreviews: { url: string; fileName: string }[] = [];
  productId: string;
  productData: any;
  productUpdateForm: FormGroup;
  productImages: File[] = [];
  coverImage: File | null = null;

  //constructor
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.productUpdateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      //PRODUCT STOCK IS PRODUCT QUANTITY
      quantity: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }

  //fixed, dia join product image dari env dulu.
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.productId).subscribe(
      (productData) => {
        this.productData = productData;
        console.log('Product data:', this.productData);

        // Assuming the property name is coverImagePath and imagesPath are relative paths
        const coverImageURL =
          environment.productImgUrl +
          '/' +
          this.productData?.data?.coverImagePath;
        const productImagesURL = this.productData?.data?.imagesPath.map(
          (imgPath: string) => environment.productImgUrl + '/' + imgPath
        );
        console.log('Cover image URL:', coverImageURL);
        console.log('Product images URL:', productImagesURL);

        this.productUpdateForm.patchValue({
          name: this.productData?.data?.name,
          description: this.productData?.data?.description,
          price: this.productData?.data?.price,
          quantity: this.productData?.data?.quantity,
          category: this.productData?.data?.category,
        });

        //set initial values for cover image previews
        if (coverImageURL) {
          this.coverPreviews.push({
            url: coverImageURL,
            fileName: this.getFileNameFromURL(coverImageURL),
          });
        }

        //set initial values for product images previews
        if (productImagesURL) {
          productImagesURL.forEach((image: any) => {
            this.imagePreviews.push({
              url: image,
              fileName: this.getFileNameFromURL(image),
            });
          });
        }
      },
      (error) => {
        console.error('Error fetch data product', error);
      }
    );
  }

  onCoverChangeOld(event: Event): void {
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

  onFileChangeOld(event: Event): void {
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input.files) {
      this.productImages = Array.from(input.files);
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

  showFileDetails(file: File): void {
    // Display file details as needed, e.g., file name, size, type
    console.log(
      `Selected File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`
    );
  }

  getFileNameFromURL(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
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

  //onSubmit
  onSubmit(): void {
    // Log the form data for debugging
    console.log('Form data:', this.productUpdateForm.value);

    // Create a FormData object
    const formData = new FormData();

    // Append form fields to the FormData
    formData.append('name', this.productUpdateForm.get('name')?.value);
    formData.append(
      'description',
      this.productUpdateForm.get('description')?.value
    );
    formData.append('price', this.productUpdateForm.get('price')?.value);
    formData.append('quantity', this.productUpdateForm.get('quantity')?.value);
    formData.append('category', this.productUpdateForm.get('category')?.value);

    // Append the cover image if it exists
    if (this.coverImage) {
      formData.append('cover', this.coverImage);
    }

    // Append product images if they exist
    this.productImages.forEach((file, index) => {
      formData.append(`images[${index}]`, file, file.name);
    });

    formData.append('owner', this.tokenService.getUserId());

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (data) => {
        // Display a success alert with SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate back to the previous page
            this.router.navigate(['/merchant/product']);
          }
        });
      },
      error: (error) => {
        // Display an error alert with SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem updating the product.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error updating product:', error);
      },
    });
  }
}
