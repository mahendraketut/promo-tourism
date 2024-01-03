import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) {}
  endpoint = environment.analyticsUrl;

  //Retreives all data related to analytics for a specific merchant for a specific year.
  //Used to check merchant analytics by merchant.
  getMerchantAnalytics(id : string, year: number): Observable<any> {
    const api = `${this.endpoint}/merchant/sales/${id}`;
    const params = {year: year.toString()};
    return this.http.get(api, {params}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }
  //Retreives all data related to analytics for all merchants for a specific year.
  //Used to check merchant analytics by admin / PRS officers.
  getAllAnalytics(year: number): Observable<any> {
    const api = `${this.endpoint}/merchant/all/${year}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  //Retreives all order, products, and merchant data for a specific merchant.
  getAllDetailsByMerchantId(id: string): Observable<any> {
    const api = `${this.endpoint}/merchant/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }
  //Retreive every details within the db.
  getAllDetails(): Observable<any> {
    const api = `${this.endpoint}/all`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  //Retreive total transaction for a merchant
  getTotalTransaction(id: string): Observable<any> {
    const api = `${this.endpoint}/merchant/total/${id}`;
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
