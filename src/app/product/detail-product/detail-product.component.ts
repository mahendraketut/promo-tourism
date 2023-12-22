import { Component, OnInit } from '@angular/core';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
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
  productID: any;
  productData: any;
  image: any = 'assets/img/imagecover.jpg';
  images: GalleryItem[];
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

  ngOnInit(): void {
    this.initConfig();
    //set item array
    this.images = [
      new ImageItem({ src: 'IMAGE_SRC_URL', thumb: 'IMAGE_THUMBNAIL_URL' }),
    ];
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
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
      },
      onCancel: (data, actions) => {
        console.log('onCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
