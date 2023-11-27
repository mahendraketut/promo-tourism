import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempService {

  private productIdCounter = 3;
  private products = [{
    id: 1,
    name: 'Example Product 1',
    description: 'Description for Example Product 1',
    price: 29.99,
    quantity: 10,
    category: 'Category A',
    productImages: ['image_url_1.jpg', 'image_url_2.jpg'],
    productCovers: ['cover_url_1.jpg']
  },
  {
    id: 2,
    name: 'Example Product 2',
    description: 'Description for Example Product 2',
    price: 29.99,
    quantity: 10,
    category: 'Category B',
    productImages: ['image_url_3.jpg', 'image_url_4.jpg'],
    productCovers: ['cover_url_2.jpg']
  },]
  constructor() { }

  getProducts(){
    console.log("all prods: ", this.products);
    return this.products
  }

  // addProduct(product){
  //   console.log("masuk add prod service");
  //   console.log("prod: ", product);
  //   try {
  //     this.products.push(product);
  //     console.log("products after push: ", this.products);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }
  addProduct(product): boolean {
    try {
      const productWithId = { id: this.productIdCounter++, ...product };
      this.products.push(productWithId);
      console.log("all prod after push: ", this.products);
      return true;
    } catch (error) {
      return false;
    }
  }

  deleteProduct(productId){
    this.products = this.products.filter(product => product.id !== productId)
  }

}