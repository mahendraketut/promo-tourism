import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endpoint: string = 'http://localhost:3000/api/product';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http:HttpClient) {
  }

  //Sends a GET request to the back-end API to retreive all products.
  getProducts(): Observable<any> {
    return this.http.get<any>(this.endpoint)
      .pipe(
        map(response => response.data),
        catchError(this.errorMgmt)
    );
  }
  //Sends a GET request to the back-end API to retreive a single product.
  getProduct(id:any): Observable<any> {
    let api = `${this.endpoint}/get/${id}`;
    return this.http.get(api).pipe(catchError(this.errorMgmt));
  }

  //Sends a POST request to the back-end API to create a new product.
  createProduct(data:any): Observable<any> {
    let api = `${this.endpoint}/create`;
    // return this.http.post(api, data);
    return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  }

  //Sends a PATCH request to the back-end API to update a product.
  updateProduct(id:any, data:any): Observable<any> {
    let api = `${this.endpoint}/update/${id}`;
    return this.http.patch(api, data, { headers: this.headers }).pipe(catchError(this.errorMgmt));
    // return this.http.patch(api, data, { headers: this.headers });
  }

  //Sends a DELETE request to the back-end API to delete a product.
  deleteProduct(id:any): Observable<any> {
    let api = `${this.endpoint}/delete/${id}`;
    return this.http.delete(api).pipe(catchError(this.errorMgmt));
    // return this.http.delete(api);
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
}
