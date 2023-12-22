import { Component, OnInit } from '@angular/core';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { firstValueFrom } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/token.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/order.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environment';


@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css'],
})
export class DetailProductComponent implements OnInit {

  //TODO:PRODUCT ID DISINI TUT
  productId: string = "6585d86d83bfc96285eba371"
  product: any = {};
  paypalResponse: any = {};

  paymentStatus: string = "";
  image: any = '';
  images: GalleryItem[] = [];
  title: string = 'Tour to Kuala Lumpur City Center (KLCC)';
  rating: number = 5;
  purchases: number = 999;
  price: number = 1000;
  discount: number = 250;
  description: any =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit ipsam, excepturi eveniet iure dolore iusto temporibus necessitatibus quisquam aspernatur beatae id, et expedita unde qui consectetur voluptatum mollitia aperiam! Excepturi.';
  stock: number = 0;
  logoMerchant: any = 'assets/img/avatar.png';
  public payPalConfig?: IPayPalConfig;

  //purchasing data
  quantity: number = 0;
  isFull: boolean = false;


  constructor(
    private tokenService: TokenService,
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  getProduct(){
    this.product = this.productService.getProduct(this.productId).subscribe({
      next: (result) => {
        this.product = result.data;
        console.log("PROOODAK:",this.product);
        console.log(this.product.coverImagePath);
        this.images.push(new ImageItem({ src: this.productService.getImageUrl(this.product.coverImagePath), thumb: this.productService.getImageUrl(this.product.coverImagePath) }));
        console.log("abis ditambah",this.images);
        for(let i = 0; i < this.product.imagesPath.length; i++){
          this.images.push(new ImageItem({ src: this.productService.getImageUrl(this.product.imagesPath[i]), thumb: this.productService.getImageUrl(this.product.imagesPath[i]) }));
        }
        console.log("abis ditambah",this.images);
        this.stock = this.product.quantity;
        this.title = this.product.name;
        // this.rating = this.product.rating;
        this.purchases = this.product.sold;
        this.price = this.product.price;
        // this.discount = this.product.discount;
        this.description = this.product.description;


      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    this.initConfig();
    this.getProduct();
  }

  //function increment()
  increment() {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }


  async checkStock(): Promise<boolean> {
    try {
      const result = await firstValueFrom(this.productService.getProduct(this.productId));
      this.product = result.data;
      this.stock = this.product.quantity;
      return this.stock >= this.quantity;
    } catch (error) {
      console.error(error);
      return false; // Assume false if there's an error
    }
  }

  isAvailable() {
    if (this.quantity == this.stock) this.isFull = true;
    else this.isFull = false;
  }

  //function decrement()
  decrement() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypal_client_id,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: (this.price * this.quantity).toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: (this.price * this.quantity).toString(),
                  },
                },
              },
              items: [
                {
                  name: this.title,
                  quantity: this.quantity.toString(),
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.price.toString(),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'pay',
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove1 - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove2 - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.paypalResponse = data;
        this.paymentStatus = data.status;
        this.createOrder();
      },
      onCancel: (data, actions) => {
        console.log('onCancel', data, actions);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Payment canceled!',
        });
      },
      onError: (err) => {
        console.log('OnError', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      },
      onClick: async (data, actions) => {
        try {
          const hasSufficientStock = await this.checkStock();
          if (!hasSufficientStock) {
            // Here you can either show an error or use Swal as you have been doing.
            Swal.fire({
              icon: 'error',
              title: 'Out of Stock',
              text: 'There is not enough stock to complete your purchase.'
            });
      
            // Then you throw an error to trigger the onError callback.
            throw new Error('Out of stock');
          }
        } catch (error) {
          // The error thrown will be caught here, which you can then use to trigger onError.
          // This might be redundant if throwing the error above already triggers onError.
          console.error('Error during onClick:', error);
          return actions.reject();
        }
      },
    };
  }

  createOrder(): void {
    console.log("creating order");
    const userId = this.tokenService.getUserId();
    const productId = this.productId;
    const quantity = this.quantity;
    const merchantId = this.product.owner;
    const total = 1000;
    const invoice = "INV-1234";
    const paypalInfo = this.paypalResponse;
    const paymentStatus = this.paymentStatus;

    const data = {
      userId,
      productId,
      quantity,
      merchantId,
      total,
      invoice,
      paypalInfo,
      paymentStatus
    };

    if(userId){
      this.orderService.createOrder(data).subscribe({
        next: (result) => {
          console.log(result);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Payment success!',
          });
          this.router.navigate(['/order']);
        },
        error: (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Payment failed!',
          });
        },
      });
    }
  }


}