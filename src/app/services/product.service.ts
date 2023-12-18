import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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




  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.endpoint}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  };

  addProduct(data:any): Observable<any> {
    let api = `${this.endpoint}/add`;
    return this.http.post(api, data).pipe(catchError(this.errorMgmt));
  }



  //Sends a PATCH request to the back-end API to update a product.
  updateProduct(id:any, data:any): Observable<any> {
    let api = `${this.endpoint}/update/${id}`;
    const formData = new FormData();
    //If there are image(s) in the data object, append them to the formData object.
    //Otherwise, append the data object to the formData object.
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        // Handle multiple images
        data[key].forEach((image: File) => {
          formData.append('images', image, image.name);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    return this.http.patch(api, formData, { headers: this.headers }).pipe(catchError(this.errorMgmt));
    // return this.http.patch(api, data, { headers: this.headers });
  }

  //Sends a DELETE request to the back-end API to delete a product.
  deleteProduct(id:any): Observable<any> {
    console.log("prod id: ", id);
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

  getProductsByMerchantId(id: any): Observable<any[]> {
    let api = `${this.endpoint}/merchant/${id}`;
    return this.http.get(api).pipe(
      map((response: any) => {
        // Assuming the response is an object that contains an array of products
        console.log("response raw: ", response);
        const productsResponse = response.data;
        if (Array.isArray(productsResponse)) {
          // If additional processing is needed, do it here
          console.log("prod res: ", productsResponse);
          return productsResponse;
        } else {
          console.log("The response is not an array.");
          return []; // Return an empty array if the response is not as expected
        }
      }),
      catchError(this.errorMgmt)
    );
  }
}
