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
}
