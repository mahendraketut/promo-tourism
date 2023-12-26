import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  endpoint: string = environment.orderUrl;

  constructor(private http:HttpClient) { }
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

  // Create
  createOrder(data): Observable<any> {
    let api = `${this.endpoint}/create`;
    return this.http.post(api, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  getOrders(): Observable<any> {
    let api = `${this.endpoint}/`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }
  getOrderById(id): Observable<any> {
    console.log("Getting order by ID: ",id );
    let api = `${this.endpoint}/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  getOrderByUserId(id): Observable<any> {
    console.log("getOrderByUserId: ", id);
    let api = `${this.endpoint}/user/${id}`;
    console.log("API_URL: ", api);
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  getOrderByMerchantId(id): Observable<any> {
    console.log("getOrderByMerchantId: ", id);
    let api = `${this.endpoint}/merchant/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  hasReviewed(id): Observable<any> {
    let api = `${this.endpoint}/hasReviewed/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  
}
