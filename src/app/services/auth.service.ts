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



  //Used to check if email is available or not when registering a user.
  // checkEmailAvailability(email: string) {
  //   return this.http.post(`${this.endpoint}/check`, { email }).pipe(
  //     map((response: any) => {
  //       // Handle the response accordingly
  //       return response;
  //     }),
  //     catchError((error) => {
  //       return error;
  //     })
  //   );
  // }
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
  registerUser(data:any): Observable<any> {
    let api = `${this.endpoint}/register`;
    return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  }



  // loginUser(data:any): Observable<any> {
  //   let api = `${this.endpoint}/login`;
  //   return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  // }
  loginUser(email: string, password: string): Observable<any> {
    let api = `${this.endpoint}/login`;
    return this.http.post(api, { email, password }).pipe(catchError(this.errorMgmt));
  }

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
  


  // Get merchants, but it also filters the merchants based on accountStatus
  // Only merchants with accountStatus === 'pending' will be returned.
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

  //filters with account status
  getMerchants(): Observable<any[]> {
    let api = `${this.endpoint}/merchants`;
    return this.http.get<any[]>(api).pipe(
      map((response: any) => {
        const merchantsResponse = response.merchants;
  
        if (Array.isArray(merchantsResponse)) {
          //Filters merchants according to their account status
          const pendingMerchants = merchantsResponse.filter((merchant: any) => merchant.accountStatus === 'pending');
          const approvedMerchants = merchantsResponse.filter((merchant: any) => merchant.accountStatus === 'approved');
          const rejectedMerchants = merchantsResponse.filter((merchant: any) => merchant.accountStatus === 'rejected');
          //Combines them into one
          const sortedMerchants = pendingMerchants.concat(approvedMerchants, rejectedMerchants);
  
          //Removes password from the response.
          //We did remove this in the back-end, but just to be safe, i removed it again.
          const merchantsWithoutPasswords = sortedMerchants.map((merchant: any) => {
            const { password, ...rest } = merchant;
            return rest;
          });
  
          return merchantsWithoutPasswords;
        } else {
          console.log("bukan array");
          return [];
        }
      }),
      catchError(this.errorMgmt)
    );
  }
  
  


  acceptMerchant(merchantId: string): Observable<any> {
    let api = `${this.endpoint}/accept?id=${merchantId}`;
    return this.http.post(api, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }
  
  rejectMerchant(merchantId: string): Observable<any> {
    let api = `${this.endpoint}/reject?id=${merchantId}`; 
    return this.http.post(api, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.errorMgmt)
    );
  }

  logoutUser(): void {
    localStorage.removeItem('token'); // Remove the token from local storage
    this.logoutBackend();

    // You might want to add any additional cleanup steps here
  }

  // Call the API endpoint for logging out on the backend
  logoutBackend(): Observable<any> {
    // Adjust the endpoint to your backend logout API
    const logoutApi = `${this.endpoint}/logout`;
    return this.http.get(logoutApi); // Assuming a GET request is used for logout in your backend
  }
}




