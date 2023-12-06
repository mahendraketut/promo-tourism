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
export class AuthService {

  endpoint: string = "http://127.0.0.1:3000/api/auth";
  constructor(private http:HttpClient) {


   }


   //post hal yang berbeda kalau misalnya dia merhant atau user biasa.
    registerUser(data:any): Observable<any> {
      let api = `${this.endpoint}/register`;
      return this.http.post(api, data).pipe(catchError(this.errorMgmt));
    }


    loginUser(data:any): Observable<any> {
      let api = `${this.endpoint}/login`;
      return this.http.post(api, data).pipe(catchError(this.errorMgmt));
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
