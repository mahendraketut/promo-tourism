import { Component, OnInit } from '@angular/core';
// import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

// import { GalleryItem, ImageItem } from '@ngx-gallery/core';
// import { Lightbox } from '@ngx-gallery/lightbox';

import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environment';
import { data, error } from 'jquery';
import { Lightbox } from 'ngx-lightbox';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css'],
})
export class DetailProductComponent implements OnInit {
  productId: string;
  productData;
  paypalResponse: any = {};
  userId: any = this.tokenService.getUserId();
  paymentStatus: string = '';
  productImages: any[] = [];
  private lightboxImages: any[] = [];
  // images: GalleryItem[] = [];
  title: string = '';
  rating: number = 5;
  purchases: number = 999;
  price: number;
  // discount: number = 250;
  description: any = '';
  stock: number = 0;
  reviewsData: any[] = [];
  logoMerchant: any = 'assets/img/avatar.png';
  public payPalConfig?: IPayPalConfig;

  //purchasing data
  quantity: number = 0;
  isFull: boolean = false;
  category: any;
  owner: any;
  priceInUSD: any;
  total: any = 0;
  merchantData: any;
  averageMerchantRate: any;
  userData: any;

  swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    // other configurations
  };

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private lightbox: Lightbox,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.getUserData();
    this.getProduct();
    this.getAverageReview(this.productId);
    // this.getAverageMerchantRate(this.merchantData._id);
  }

  // openLightbox(index: number) {
  //   this.lightbox.open(index);
  // }

  getProduct() {
    // Request to get the id from params and save it into productId
    this.productId = this.route.snapshot.paramMap.get('id');
    // TODO below is console log that can be deleted if dev.process already done
    console.log('ID:' + this.productId);
    this.productService.getProduct(this.productId).subscribe({
      next: (data) => {
        // Put the data into product data
        this.productData = data.data;
        // TODO show the data in console.log. Remove it when dev step done
        console.log('Product data: ', this.productData);
        //put the data
        this.title = this.productData?.name;
        this.description = this.productData?.description;
        this.price = this.productData?.price;
        // this.priceInUSD = this.currencyExchange(this.price);
        this.stock = this.productData?.quantity;
        this.category = this.productData?.category;
        this.owner = this.productData?.owner;
        this.purchases = this.productData?.sold;
        this.getMerchant(this.owner);
        // this.getAverageMerchantRate(this.merchantData._id);
        // this.getUser();
        this.getReviews(this.productId);
        console.log('merchant', this.owner);

        // this.getReviewsPerProduct(this.productData?._id);
        // Put the cover image data to imageProduct array
        if (this.productData?.coverImagePath) {
          this.productImages.push(
            environment.productImgUrl + '/' + this.productData?.coverImagePath
          );
          // const url =
          //   environment.productImgUrl + '/' + this.productData?.coverImagePath;
          // this.images.push(new ImageItem({ src: url, thumb: 'product' }));
        }
        // Put the image data to imageProduct array
        if (this.productData?.imagesPath) {
          this.productData?.imagesPath.map((imgPath: string) => {
            this.productImages.push(environment.productImgUrl + '/' + imgPath);
          });
          // this.productData?.imagesPath.map((imgPath: string) => {
          //   const url = environment.productImgUrl + '/' + imgPath;
          //   this.images.push(new ImageItem({ src: url, thumb: 'product' }));
          // });
        }

        this.productImages.forEach((src) => {
          const album = {
            src: src,
          };
          this.lightboxImages.push(album);
        });

        console.log('Product images URL:', this.productImages);
        console.log('Lightbox images:', this.lightboxImages);
        this.currencyExchange(this.productData?.price);
        // console.log(this.priceInUSD);
      },
      error: (error) => {
        // TODO show error message in console when the fetching process is Error
        console.error('Error fetching product:', error);
      },
      complete: () => {
        // TODO show message in console when the fetching process is complete
        console.log('Product data retrieval complete.');
      },
    });
  }

  getMerchant(merchantId: string) {
    this.authService.getMerchantById(merchantId).subscribe({
      next: (data) => {
        this.merchantData = data.merchant;
        console.log('Merchant:', this.merchantData);
        this.getAverageMerchantRate(merchantId);
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
      complete: () => {
        console.log('Product data retrieval complete.');
      },
    });
  }

  getAverageMerchantRate(merchantId: string) {
    this.reviewService.getMerchantAverage(merchantId).subscribe({
      next: (data) => {
        if (!data.data) {
          this.averageMerchantRate = 0;
          console.log('Merchant rating:', this.averageMerchantRate);
        } else {
          this.averageMerchantRate = data.data;
          console.log('Merchant rating:', this.averageMerchantRate);
        }
      },
    });
  }

  getUserData() {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      console.log(decodedToken); // Log the decoded token
      this.userData = decodedToken;
    } else {
      console.log('Token is not valid or not present');
    }
  }

  getAverageReview(productId: string) {
    //put the averageRating from ratingService to the rating
    this.reviewService.getReviewAverage(productId).subscribe({
      next: (data) => {
        if (!data.data) {
          this.rating = 0;
          console.log('rating:', this.rating);
        } else {
          this.rating = Math.round(data.data);
          console.log('rating:', this.rating);
        }
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
      complete: () => {
        console.log('Product data retrieval complete.');
      },
    });
  }

  getReviews(id: string) {
    this.reviewService.getReviews(id).subscribe({
      next: (data) => {
        this.reviewsData = data.data;
        console.log('reviews', this.reviewsData);
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
      complete: () => {
        console.log('Reviews data retrieval complete.');
      },
    });
  }

  openLightBox(index: number) {
    this.lightbox.open(this.lightboxImages, index);
  }

  closeLightBox(): void {
    this.lightbox.close();
  }

  currencyExchange(amountMYR: number): void {
    // Log the input amount for debugging
    console.log('Converting amount:', amountMYR);

    this.productService.convertMYRtoUSD(amountMYR).subscribe((amountInUSD) => {
      const converted = amountInUSD.toFixed(2);
      this.priceInUSD = converted;

      // Log the converted amount for debugging
      console.log('Converted amount in USD:', this.priceInUSD);

      // Additional logic that uses this.priceInUSD
    });
  }

  async checkStock(): Promise<boolean> {
    try {
      this.stock = this.productData.quantity;
      return this.stock >= this.quantity;
    } catch (error) {
      console.error(error);
      return false; // Assume false if there's an error
    }
  }

  // async checkStock(): Promise<boolean> {
  //   try {
  //     const result = await firstValueFrom(
  //       this.productService.getProduct(this.productId)
  //     );
  //     this.productData = result.data;
  //     this.stock = this.productData.quantity;
  //     return this.stock >= this.quantity;
  //   } catch (error) {
  //     console.error(error);
  //     return false; // Assume false if there's an error
  //   }
  // }

  isAvailable() {
    if (this.productData.quantity == this.stock) this.isFull = true;
    else this.isFull = false;
  }

  //function increment()
  increment() {
    if (this.quantity < this.productData.quantity) {
      this.quantity++;
      this.total = this.price * this.quantity;
    }
  }

  //function decrement()
  decrement() {
    if (this.quantity > 0) {
      this.quantity--;
      this.total = this.price * this.quantity;
    }
  }

  //method to generate Invoice number

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
                value: (this.priceInUSD * this.quantity).toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: (this.priceInUSD * this.quantity).toString(),
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
                    value: this.priceInUSD.toString(),
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
          // Check if the user is authenticated
          const authToken = this.tokenService.getToken; // Assuming getToken() is a method to retrieve the token
          if (!authToken) {
            Swal.fire({
              icon: 'error',
              title: 'Unauthorized',
              text: 'You must be logged in to make a payment.',
            });
            return actions.reject(); // Reject the transaction
          }

          // Check if there is sufficient stock
          const hasSufficientStock = await this.checkStock();
          if (!hasSufficientStock) {
            Swal.fire({
              icon: 'error',
              title: 'Out of Stock',
              text: 'There is not enough stock to complete your purchase.',
            });
            throw new Error('Out of stock');
          }
        } catch (error) {
          console.error('Error during onClick:', error);
          return actions.reject();
        }
      },
    };
  }

  createOrder(): void {
    console.log('creating order');
    const userId = this.tokenService.getUserId();
    const productId = this.productId;
    const quantity = this.quantity;
    const merchantId = this.productData?.owner;
    const total = this.total;
    const invoice = this.productService.generateInvoice();
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
      paymentStatus,
    };

    if (userId) {
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please login first!',
      });
    }
  }
}
