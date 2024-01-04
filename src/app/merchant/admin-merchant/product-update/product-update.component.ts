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
import { TokenService } from 'src/app/services/token.service';

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
  changeImages: boolean = false;
  tinyAPI: string = environment.tinyMCEAPI;

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
      quantity: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }
//Retreive product information and images from the backend.
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.productId).subscribe(
      (productData) => {
        this.productData = productData;
        const coverImageURL =
          environment.productImgUrl +
          '/' +
          this.productData?.data?.coverImagePath;
        const productImagesURL = this.productData?.data?.imagesPath.map(
          (imgPath: string) => environment.productImgUrl + '/' + imgPath
        );

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
  //This will be triggered if the user updates the cover image.
  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input.files && input.files.length) {
      this.coverImage = input.files[0];
      this.coverPreviews = [];

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

//This will be triggered if the user updates the product images.
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (input.files) {
      this.productImages = Array.from(input.files);
      this.imagePreviews = [];
      this.changeImages = true;

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

  //Displays file details
  showFileDetails(file: File): void {
    console.log(
      `Selected File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`
    );
  }

  //Parse the file name from the params url
  getFileNameFromURL(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  //Parse the file size from the params url
  getFileSizeFromURL(url: string): string {
    // Extract file size from URL
    const sizeInBytes = url.length * 0.75;
    const sizeInKb = sizeInBytes / 1024;
    return `${sizeInKb.toFixed(2)} KB`;
  }

  //Reset images
  resetImagePreviews(): void {
    this.imagePreviews = [];
    this.coverPreviews = [];
  }

  //onSubmit function
  //This will be triggered if the user clicks the submit button.
  //The products information will be inserted into a form data.
  //Then, the form data will be sent to the backend using product service.
  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.productUpdateForm.get('name')?.value);
    formData.append(
      'description',
      this.productUpdateForm.get('description')?.value
    );
    formData.append('price', this.productUpdateForm.get('price')?.value);
    formData.append('quantity', this.productUpdateForm.get('quantity')?.value);
    formData.append('category', this.productUpdateForm.get('category')?.value);

    formData.append('changeImages', this.changeImages.toString());
    //append new cover images if it exists
    if (this.coverImage) {
      formData.append('cover', this.coverImage);
    }
    //append new product images if it exists
    this.productImages.forEach((file, index) => {
      formData.append(`images[${index}]`, file, file.name);
    });
    //append the owner id (Merchant ID)
    formData.append('owner', this.tokenService.getUserId());

    //Forward the form data to the product service.
    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        //success
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            //Redirects merchant to previous page.
            this.router.navigate(['/merchant/product']);
          }
        });
      },
      error: (error) => {
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
