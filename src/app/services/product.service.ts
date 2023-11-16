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

  // getProducts(): Observable<any> {
  //   // let api = `${this.endpoint}`;
  //   // return this.http.get(api)
  //   console.log("product service kepanggil");
  //   let products = this.http.get<any>(this.endpoint);
  //   console.log("produk kepanggil: ",products);
  //   return this.http.get<any>(this.endpoint) // Ensure the correct endpoint is used
  //       .pipe(
  //           catchError(this.errorMgmt)
  //       );
  // }
  getProducts(): Observable<any> {
    return this.http.get<any>(this.endpoint)
        .pipe(
            map(response => response.data), // Ensure this mapping is correct based on your backend response
            catchError(this.errorMgmt)
        );
}

  getProduct(id:any): Observable<any> {
    let api = `${this.endpoint}/get/${id}`;
    console.log("product service kepanggil");
    return this.http.get(api).pipe(catchError(this.errorMgmt));
    // return this.http.get(api);
  }

  //TODO: check kalau header perlu apa nggak
  createProduct(data:any): Observable<any> {
    let api = `${this.endpoint}/create`;
    // return this.http.post(api, data);
    return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  }

  updateProduct(id:any, data:any): Observable<any> {
    let api = `${this.endpoint}/update/${id}`;
    return this.http.patch(api, data, { headers: this.headers }).pipe(catchError(this.errorMgmt));
    // return this.http.patch(api, data, { headers: this.headers });
  }

  deleteProduct(id:any): Observable<any> {
    let api = `${this.endpoint}/delete/${id}`;
    return this.http.delete(api).pipe(catchError(this.errorMgmt));
    // return this.http.delete(api);
  }

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
