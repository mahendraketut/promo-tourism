import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  @ViewChild('invoice', { static: false }) contentToConvert: ElementRef;
  @Input() value: number;
  @Output() valueChange = new EventEmitter<number>();

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

  // scroll smoothly to object Id that targeted in button
  smoothScroll(elementId: string): void {
    let scroll = document.getElementById(elementId);
    scroll?.scrollIntoView({ behavior: 'smooth' });
  }

  setRating(rating: number): void {
    this.value = rating;
    this.valueChange.emit(this.value);
    console.log('current rating given: ' + this.value);
  }
}
