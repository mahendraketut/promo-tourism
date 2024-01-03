import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/app/environment';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  products: any[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private productService: ProductService) {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  //Retreive the cover image URL.
  readCoverImageURL(coverImagePath: string): string {
    return environment.productImgUrl + '/' + coverImagePath;
  }

  //Scrolls left on the carousel.
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollTo({
      left: this.scrollContainer.nativeElement.scrollLeft - 300,
      behavior: 'smooth',
    });
  }
  //Scrolls right on the carousel.
  scrollRight() {
    this.scrollContainer.nativeElement.scrollTo({
      left: this.scrollContainer.nativeElement.scrollLeft + 300,
      behavior: 'smooth',
    });
  }
}
