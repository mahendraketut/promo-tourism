import { Component, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environment';
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
  title: string = '';
  rating: number = 5;
  purchases: number = 999;
  price: number;
  description: any = '';
  stock: number = 0;
  reviewsData: any[] = [];
  logoMerchant: any = 'assets/img/avatar.png';
  isLoading: boolean = true;
  isPayPalBtn: boolean = false;
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

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    console.log('loader initiated', this.isLoading);
    this.productId = this.route.snapshot.paramMap.get('id');

    try {
      console.log('start try init data gan', this.isLoading);

      // Start both the data fetching and a minimum delay
      await Promise.all([
        this.getProduct(),
        this.getAverageReview(this.productId),
        this.delay(1000), // Ensures loader is displayed for at least 2 seconds
      ]);

      // Only await getUserData and initConfig if the token is present
      const token = this.tokenService.getToken();
      if (token) {
        await this.getUserData();
        await this.initConfig();
        this.isPayPalBtn = true;
      } else {
        console.error('No token present. Data may not load correctly.');
        this.isPayPalBtn = false;
      }
    } catch (error) {
      console.error('Error during initialization', error);
    } finally {
      this.isLoading = false;
    }
  }

  //Create a delay to ensure loader is displayed properly.
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  //Retreive selected product from the backend API.
  getProduct(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productId = this.route.snapshot.paramMap.get('id');

      this.productService.getProduct(this.productId).subscribe({
        next: (data) => {
          this.productData = data.data;

          if (this.productData?.coverImagePath) {
            this.productImages.push(
              environment.productImgUrl + '/' + this.productData?.coverImagePath
            );
          }
          if (this.productData?.imagesPath) {
            this.productData?.imagesPath.forEach((imgPath: string) => {
              this.productImages.push(
                environment.productImgUrl + '/' + imgPath
              );
            });
          }
          this.productImages.forEach((src) => {
            this.lightboxImages.push({ src: src });
          });

          this.title = this.productData?.name;
          this.description = this.productData?.description;
          this.price = this.productData?.price;
          this.stock = this.productData?.quantity;
          this.category = this.productData?.category;
          this.owner = this.productData?.owner;
          this.purchases = this.productData?.sold;
          this.getMerchant(this.owner); // Ensure getMerchant is also async or handled properly
          this.getReviews(this.productId); // Ensure getReviews is also async or handled properly

          this.currencyExchange(this.productData?.price); // Ensure currencyExchange is also async or handled properly
          resolve(); // Resolve the promise when data is successfully fetched
        },
        error: (error) => {
          console.error('Error fetching product:', error);
          reject(error); // Reject the promise on error
        },
        complete: () => {
          console.log('Product data retrieval complete.');
        },
      });
    });
  }

 //Retreive the merchant information
  getMerchant(merchantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.getMerchantById(merchantId).subscribe({
        next: (data) => {
          this.merchantData = data.merchant;
          this.getAverageMerchantRate(merchantId); 
          resolve();
        },
        error: (error) => {
          console.error('Error fetching merchant:', error);
          reject(error); // Reject the promise on error
        },
      });
    });
  }

  //Retreive the average review of said product.
  getAverageMerchantRate(merchantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reviewService.getMerchantAverage(merchantId).subscribe({
        next: (data) => {
          if (!data.data) {
            this.averageMerchantRate = 0;
          } else {
            this.averageMerchantRate = Math.round(data.data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Error fetching merchant average rate:', error);
          reject(error);
        },
        complete: () => {
          console.log('Merchant average rate retrieval complete.');
        },
      });
    });
  }

  getUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const decodedToken = this.tokenService.decodeToken();
      if (decodedToken) {
        this.userData = decodedToken;
        resolve();
      } else {
        console.log('Token is not valid or not present');
        reject(new Error('Token is not valid or not present')); 
      }
    });
  }

  getAverageReview(productId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reviewService.getReviewAverage(productId).subscribe({
        next: (data) => {
          if (!data.data) {
            this.rating = 0;
          } else {
            this.rating = Math.round(data.data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Error fetching average review:', error);
          reject(error);
        },
      });
    });
  }


  getReviews(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reviewService.getReviews(id).subscribe({
        next: (data) => {
          if (Array.isArray(data.data)) {
            this.reviewsData = data.data;
            resolve(); // Resolve the promise when data is successfully fetched
          } else {
            console.error('Expected an array of reviews, but got:', data.data);
            reject(new Error('Data format is incorrect')); // Reject the promise on data format error
          }
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
          reject(error); // Reject the promise on request error
        },
      });
    });
  }

  openLightBox(index: number) {
    this.lightbox.open(this.lightboxImages, index);
  }

  closeLightBox(): void {
    this.lightbox.close();
  }

  currencyExchange(amountMYR: number): void {
    this.productService.convertMYRtoUSD(amountMYR).subscribe((amountInUSD) => {
      const converted = amountInUSD.toFixed(2);
      this.priceInUSD = converted;
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

  private initConfig(): void {
    // Initialize PayPal configuration
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypal_client_id,

      // Function to create the order on the client side
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

      // Advanced configuration
      advanced: {
        commit: 'true',
      },

      style: {
        label: 'pay',
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
      },

      // Handler for client authorization
      onClientAuthorization: (data) => {
        console.log(
          'Transaction complete'
        );
        this.paypalResponse = data;
        this.paymentStatus = data.status;
        this.createOrder(); // Call to create the order
      },

      // Handler for payment cancellation
      onCancel: (data, actions) => {
        console.log('onCancel');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Payment canceled!',
        });
      },

      // Handler for errors
      onError: (err) => {
        console.log('OnError', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      },

      // Handler for the PayPal button click
      onClick: async (data, actions) => {
        try {
          // Checking if the user is authenticated
          const authToken = this.tokenService.getToken; // Assuming getToken() is a method to retrieve the token
          if (!authToken) {
            Swal.fire({
              icon: 'error',
              title: 'Unauthorized',
              text: 'You must be logged in to make a payment.',
            });
            return actions.reject(); // Reject the transaction if not authenticated
          }

          // Checking stock availability
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
          return actions.reject(); // Reject the transaction on error
        }
      },
    };
  }

  createOrder(): void {
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
