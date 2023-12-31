import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/app/environment';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';

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
  searchTerm: string;
  filteredProducts: any[] = [];
  selectedSortOption: string = 'default';
  selectedFilterOption: string = 'all';
  currentPage: any = 1;
  itemsPerPage: any = 1;
  // totalItems = this.filterProducts.length;
  productForm: FormGroup;
  mathCeil = Math.ceil;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router, // private searchSubject: Subject<string> = new Subject()
    private reviewService: ReviewService
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
  ngOnInit() {
    // this.searchSubject
    //   .pipe(
    //     debounceTime(300) //wait 300ms wait in events
    //   )
    //   .subscribe((searchTerm) => {
    //     this.onSearch(searchTerm);
    //   });
    this.filteredProducts = this.products || [];
  }
  //Gets all products from the product service.

  readProduct() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = this.products;
      // this.totalItems = this.filterProducts.length;
      console.log('data: ', data);
      console.log(this.filteredProducts);
    });
  }

  //Get the rating of a product
  // getRating(productId: string) {
  //   let review = 0;
  //   this.reviewService.getReviewAverage(productId).subscribe({
  //     next: (data) => {
  //       console.log('Ini data review', data);
  //     },
  //     error: (error) => console.error('There was an error!', error),
  //   });
  //   return review;
  // }

  readCoverImageURL(coverImagePath: string): string {
    return environment.productImgUrl + '/' + coverImagePath;
  }

  onSearch(): void {
    // Apply search
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(searchTermLower)
      );
    } else {
      // If the search term is empty, reset to the full list of products
      this.filteredProducts = [...this.products];
    }

    // Apply filter
    if (this.selectedFilterOption !== 'all') {
      this.filteredProducts = this.filteredProducts.filter(
        (product) => product.category === this.selectedFilterOption
      );
    }

    // Apply sort
    switch (this.selectedSortOption) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-asc':
        this.filteredProducts.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-desc':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // If 'default' is selected, no additional sorting is needed
        break;
    }
  }

  sortProducts() {
    switch (this.selectedSortOption) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-asc':
        this.filteredProducts.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-desc':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        this.filteredProducts = this.filteredProducts;
        break;
    }
  }

  //method to filter the products
  filterProducts() {
    if (this.selectedFilterOption === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.category === this.selectedFilterOption
      );
    }
  }

  // get paginatedProducts() {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   return this.filteredProducts.slice(
  //     startIndex,
  //     startIndex + this.itemsPerPage
  //   );
  // }

  // onPageChange(page: number) {
  //   this.currentPage = page;
  // }

  //Deletes a product using the product service.
  deleteProduct(product, index) {
    if (window.confirm('Are you sure?')) {
      this.productService.deleteProduct(product._id).subscribe((data) => {
        this.products.splice(index, 1);
      });
    }
  }
}
