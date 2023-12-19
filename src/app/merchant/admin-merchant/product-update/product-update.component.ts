import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

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
    private formBuilder: FormBuilder
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

  //ngOnInit
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.productId).subscribe(
      (productData) => {
        this.productData = productData;
        console.log('Product data:', this.productData);

        // Assuming the property name is coverImagePath
        const coverImageURL = this.productData?.data?.coverImagePath;
        //assuming we want to add the list of product images into imagePreviews
        const productImagesURL = this.productData?.data?.imagesPath;
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

  // initializeForm(): void {
  //   this.productUpdateForm = this.formBuilder.group({
  //     name: [this.productData.name, Validators.required],
  //     description: [this.productData.description, Validators.required],
  //     price: [this.productData.price, Validators.required],
  //     quantity: [this.productData.quantity, Validators.required],
  //     category: [this.productData.category, Validators.required],
  //   });

  //   //set initial values for cover image previews
  //   if (this.productData.coverImage) {
  //     this.coverPreviews.push({
  //       url: this.productData.coverImage,
  //       fileName: this.getFileNameFromURL(this.productData.coverImage),
  //     });
  //   }

  //   //set initial values for product image previews
  //   if (this.productData.images) {
  //     this.productData.images.forEach((image: any) => {
  //       this.imagePreviews.push({
  //         url: image,
  //         fileName: this.getFileNameFromURL(image),
  //       });
  //     });
  //   }
  // }

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
    console.log('Form data:', this.productUpdateForm.value);
    console.log('Product data:', this.productData);
    const formData = this.productUpdateForm.value;
    this.productService
      .updateProduct(this.productId, formData)
      .subscribe((data) => {
        console.log('Product updated:', data);
      });
  }
}
