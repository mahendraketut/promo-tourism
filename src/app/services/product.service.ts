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



  

  // //Sends a POST request to the back-end API to create a new product.
  // createProduct(data:any): Observable<any> {
  //   console.log("sampe createprod");
  //   let api = `${this.endpoint}/create`;
  //   //this is the image handling
  //   const formData = new FormData();
  //   //If there are image(s) in the data object, append them to the formData object.
  //   //Otherwise, append the data object to the formData object.
  //   Object.keys(data).forEach(key => {
  //     if (key === 'images' && Array.isArray(data[key])) {
  //       // Handle multiple images
  //       data[key].forEach((image: File) => {
  //         formData.append('images', image, image.name);
  //       });
  //     } else {
  //       formData.append(key, data[key]);
  //     }
  //   });

  //   //Post the formData object to the back-end API.
  //   return this.http.post(api, formData).pipe(catchError(this.errorMgmt));
  // }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.endpoint}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  createProduct(data:any, files:any): Observable<any> {
    console.log("sampe createprod");
    let api = `${this.endpoint}/create`;
    //this is the image handling
    const formData: FormData = new FormData();
    if(files){
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }

    console.log("formdata:",formData);
    // //If there are image(s) in the data object, append them to the formData object.
    // //Otherwise, append the data object to the formData object.
    // Object.keys(data).forEach(key => {
    //   if (key === 'images' && Array.isArray(data[key])) {
    //     // Handle multiple images
    //     data[key].forEach((image: File) => {
    //       formData.append('images', image, image.name);
    //     });
    //   } else {
    //     formData.append(key, data[key]);
    //   }
    // });

    //Post the formData object to the back-end API.
    return this.http.post(api, formData).pipe(catchError(this.errorMgmt));
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
