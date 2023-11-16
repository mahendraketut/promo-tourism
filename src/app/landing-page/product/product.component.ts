
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  
  products:any = [];
  constructor(private productService: ProductService) { 
    this.readProduct();
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
}

