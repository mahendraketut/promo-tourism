import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  endpoint = environment.reviewUrl;
  constructor(private http:HttpClient) {
  }

  createReview(review: any) {
    const api = `${this.endpoint}/create`;
    return this.http.post(api, review).pipe(catchError(this.errorMgmt));
  }

  getReviews(productId: string): Observable<any> {
    const api = `${this.endpoint}/product/${productId}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  getReviewbyId(reviewId: string): Observable<any> {
    const api = `${this.endpoint}/${reviewId}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  getReviewAverage(productId: string): Observable<any> {
    const api = `${this.endpoint}/average/${productId}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
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
