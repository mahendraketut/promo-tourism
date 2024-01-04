import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  endpoint: string = environment.productUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}

  //Sends a GET request to the back-end API to retreive all products.
  getProducts(): Observable<any> {
    return this.http.get<any>(this.endpoint).pipe(
      map((response) => response.data),
      catchError(this.errorMgmt)
    );
  }
  //Sends a GET request to the back-end API to retreive a single product.
  getProduct(id: any): Observable<any> {
    let api = `${this.endpoint}/get/${id}`;
    return this.http.get(api).pipe(catchError(this.errorMgmt));
  }

  //Sends a POST request to the back-end API to add a product.
  addProduct(data: any): Observable<any> {
    let api = `${this.endpoint}/add`;
    return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  }

  //Sends a PATCH request to the back-end API to update a product.
  updateProduct(id: any, data: FormData): Observable<any> {
    let api = `${environment.productUrl}/update/${id}`;
    // No need to set 'Content-Type': 'multipart/form-data' as Angular does it automatically with FormData
    return this.http.patch(api, data).pipe(catchError(this.errorMgmt));
  }

  //Sends a DELETE request to the back-end API to delete a product.
  deleteProduct(id: any): Observable<any> {
    console.log('prod id: ', id);
    let api = `${this.endpoint}/delete/${id}`;
    return this.http.delete(api).pipe(catchError(this.errorMgmt));
    // return this.http.delete(api);
  }

  //Sends a GET request to the back-end API to retreive all products of a merchant.
  getProductsByMerchantId(id: any): Observable<any[]> {
    let api = `${this.endpoint}/merchant/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        const productsResponse = response.data;
        if (Array.isArray(productsResponse)) {
          return productsResponse;
        } else {
          return [];
        }
      }),
      catchError(this.errorMgmt)
    );
  }

  getImageUrl(relativePath: string): string {
    return `${environment.apiUrl}/productimg/${relativePath}`;
  }

  //General error handling for for the product service.
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  convertMYRtoUSD(amount: number): Observable<number> {
    return this.http.get(environment.currencyExchangeAPI).pipe(
      map((data: any) => {
        const exchangeRate = data.rates.USD;
        return amount * exchangeRate; // Return the converted amount
      }),
      catchError((error) => {
        // Handle any errors here
        console.error('Error in currency conversion:', error);
        return of(0);
      })
    );
  }

  generateInvoice(): string {
    var result = 'INV';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
