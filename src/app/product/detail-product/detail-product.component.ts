import { Component, OnInit } from '@angular/core';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

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
  // template: '<gallery [items]="images"></gallery>',
  // standalone: true,
  // imports: [GalleryModule],
})
export class DetailProductComponent implements OnInit {

  //TODO:PRODUCT ID DISINI TUT
  productId: string = "6585bccb7fcaf73f2a7ff672"
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
  stock: number = 3;
  logoMerchant: any = 'assets/img/avatar.png';
  public payPalConfig?: IPayPalConfig;

  //purchasing data
  quantity: number = 0;
  isFull: boolean = false;


  constructor(
    private authService: AuthService,
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
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
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