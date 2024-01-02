import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/app/environment';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {}
