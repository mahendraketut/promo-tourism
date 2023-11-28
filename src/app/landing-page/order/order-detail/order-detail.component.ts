import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  @ViewChild('invoice', { static: false }) contentToConvert: ElementRef;
  setRating(arg0: number) {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  dateOrder: any;
  isReviewed: boolean;
  reviewForm: FormGroup<any>;
  invoiceName: string;

  constructor(private pdfService: PdfService) {
    this.isReviewed = false;
    this.dateOrder = '17 November 2023';
    this.invoiceName = 'invoice' + Date.now().toString();
  }

  exportToPdf() {
    const getElementById = 'invoice';
    const fileName = this.invoiceName;
    this.pdfService.exportToPdf(getElementById, fileName);
  }
}
