import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // endpoint: string = "http://127.0.0.1:3000/api/auth";
  endpoint: string = environment.authUrl;
  constructor(private http: HttpClient, private router: Router) {}

  //Checks if an email adress is available.
  //Request forwarded to the checkEmail method in auth controller.
  checkEmailAvailability(email: string) {
    return this.http.post(`${this.endpoint}/check`, { email }).pipe(
      map((response: any) => {
        // Handle the response accordingly
        return response;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  //Registers a user.
  //request forwarded to register method in the auth controller.
  registerUser(data: any): Observable<any> {
    let api = `${this.endpoint}/register`;
    return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  }

  //Logs in a user.
  loginUser(email: string, password: string): Observable<any> {
    let api = `${this.endpoint}/login`;
    return this.http
      .post(api, { email, password })
      .pipe(catchError(this.errorMgmt));
  }

  //method to get user data in token
  getUserData(): any {
    const token = localStorage.getItem('token');
    return token;
  }

  //method to get userdata based on id
  getUserDataById(id: string): Observable<any> {
    let api = `${this.endpoint}/merchant/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  //method to check user can activate login page
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, show swal
      this.router.navigate(['/error/403']);

      return false;
    }
    // If no token, allow access to the route
    return true;
  }

  //General error management to intercept errors from the backend.
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage); // Use console.error for errors
    return throwError(() => error); // Return the actual error object
  }

  //Retreives merchants, but it also sorts the merchants based on accountStatus.
  //returns merchant with accountStatus pending first, then approved, then rejected.
  //Sorting is done here rather than the back-end.
  getMerchants(): Observable<any[]> {
    let api = `${this.endpoint}/merchants`;
    return this.http.get<any[]>(api).pipe(
      map((response: any) => {
        const merchantsResponse = response.merchants;

        if (Array.isArray(merchantsResponse)) {
          //Filters merchants according to their account status
          const pendingMerchants = merchantsResponse.filter(
            (merchant: any) => merchant.accountStatus === 'pending'
          );
          const approvedMerchants = merchantsResponse.filter(
            (merchant: any) => merchant.accountStatus === 'approved'
          );
          const rejectedMerchants = merchantsResponse.filter(
            (merchant: any) => merchant.accountStatus === 'rejected'
          );
          //Combines them into one
          const sortedMerchants = pendingMerchants.concat(
            approvedMerchants,
            rejectedMerchants
          );

          //Removes password from the response.
          //We did remove this in the back-end, but just to be safe, i removed it again (redundancy).
          const merchantsWithoutPasswords = sortedMerchants.map(
            (merchant: any) => {
              const { password, ...rest } = merchant;
              return rest;
            }
          );

          return merchantsWithoutPasswords;
        } else {
          console.log('bukan array');
          return [];
        }
      }),
      catchError(this.errorMgmt)
    );
  }

  //Retreives merchants that have been accepted into the system.
  //returns merchant with accountStatus approved.
  //Used for analytics.
  getAcceptedMerchants(): Observable<any[]> {
    let api = `${this.endpoint}/merchants`;
    return this.http.get<any[]>(api).pipe(
      map((response: any) => {
        const merchantsResponse = response.merchants;

        if (Array.isArray(merchantsResponse)) {
          //Filters merchants according to their account status
          const approvedMerchants = merchantsResponse.filter(
            (merchant: any) => merchant.accountStatus === 'approved'
          );

          //Removes password from the response.
          //We did remove this in the back-end, but just to be safe, i removed it again (redundancy).
          const merchantsWithoutPasswords = approvedMerchants.map(
            (merchant: any) => {
              const { password, ...rest } = merchant;
              return rest;
            }
          );

          return merchantsWithoutPasswords;
        } else {
          console.log('bukan array');
          return [];
        }
      }),
      catchError(this.errorMgmt)
    );
  }


  //Retreive a specific merchant according to their ID.
  getMerchantById(merchantId: string): Observable<any> {
    let api = `${this.endpoint}/merchant/${merchantId}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  //Accepts a merchant registration request according to their ID.
  acceptMerchant(merchantId: string): Observable<any> {
    let api = `${this.endpoint}/accept?id=${merchantId}`;
    return this.http.post(api, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  //Rejects a merchant registration request according to their ID.
  rejectMerchant(merchantId: string): Observable<any> {
    let api = `${this.endpoint}/reject?id=${merchantId}`;
    return this.http.post(api, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  //Logs a user out by removing the user's token from local storage.
  logoutUser(): void {
    localStorage.removeItem('token'); // Remove the token from local storage
    //     this.logoutBackend();
    localStorage.removeItem('__paypal_storage__');
  }

  // //Only clears the cookie, this is redundant since we dont store the data in the front-
  // logoutBackend(): Observable<any> {
  //   let api = `${this.endpoint}/logout`;
  //   return this.http.post(api, {}).pipe(
  //     map((response: any) => {
  //       return response;
  //     }),
  //     catchError(this.errorMgmt)
  //   );
  // }

  //Used by merchants to change their password, forwards the user ID, new pass and old pass to the back-end.
  changePassword(
    currentPassword: string,
    newPassword: string,
    userId: string
  ): Observable<any> {
    let api = `${this.endpoint}/changepassword`;
    return this.http
      .patch(api, { currentPassword, newPassword, userId })
      .pipe(catchError(this.errorMgmt));
  }

  //First step of the forget password process.
  //Forwards the user's email to the back-end.
  //The back-end will then send a verification code to the user's email.
  forgetPasswordFirst(email: string): Observable<any> {
    console.log('masuk service forgetpass');
    console.log('masuk service forgetpass');
    let api = `${this.endpoint}/forgetpassword`;
    return this.http.post(api, { email }).pipe(catchError(this.errorMgmt));
  }
  //Seocond step of the forgot password process.
  //User needs to input new password along with the right verification and their email to proceed.
  forgetPasswordSecond(
    newPassword: string,
    verificationCode: string,
    email: string
  ): Observable<any> {
    console.log('masuk service forgetpass');
    let api = `${this.endpoint}/val`;
    return this.http
      .post(api, { newPassword, verificationCode, email })
      .pipe(catchError(this.errorMgmt));
  }
}

//Get merchants, but it also filters the merchants based on accountStatus
//Only merchants with accountStatus === 'pending' will be returned.
// getMerchants(): Observable<any[]> {
//   let api = `${this.endpoint}/merchants`;
//   console.log("masuk service get merchants");
//   return this.http.get<any[]>(api).pipe(
//     map((response: any) => {

//       const merchantsResponse = response.merchants;

//       if (Array.isArray(merchantsResponse)) {
//         const filteredMerchants = merchantsResponse.filter((merchant: any) => {
//           return merchant.accountStatus === 'pending';
//         });

//         const merchantsWithoutPasswords = filteredMerchants.map((merchant: any) => {
//           console.log("merchant without pass", merchant);
//           const { password, ...rest } = merchant;
//           return rest;
//         });
//         return merchantsWithoutPasswords;
//       } else {
//         console.log("bukan array");
//         return [];
//       }
//     }),
//     catchError(this.errorMgmt)
//   );
// }

//retreives no filter
// getMerchants(): Observable<any[]> {
//   let api = `${this.endpoint}/merchants`;
//   console.log("masuk service get merchants");
//   return this.http.get<any[]>(api).pipe(
//     map((response: any) => {
//       const merchantsResponse = response.merchants;

//       if (Array.isArray(merchantsResponse)) {
//         const merchantsWithoutPasswords = merchantsResponse.map((merchant: any) => {
//           const { password, ...rest } = merchant;
//           return rest;
//         });
//         return merchantsWithoutPasswords;
//       } else {
//         console.log("bukan array");
//         return [];
//       }
//     }),
//     catchError(this.errorMgmt)
//   );
// }

// //General error management.
// errorMgmt(error: HttpErrorResponse) {
//   let errorMessage = '';
//   if (error.error instanceof ErrorEvent) {
//     // Get client-side error
//     errorMessage = error.error.message;
//   } else {
//     // Get server-side error
//     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//   }
//   console.log(errorMessage);
//   return throwError(() => {
//     return errorMessage;
//   });
// }
