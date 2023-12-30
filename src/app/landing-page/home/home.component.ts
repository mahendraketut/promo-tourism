import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor() {}
  //Scrolls left on the carousel.
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollTo({
      left: this.scrollContainer.nativeElement.scrollLeft - 300,
      behavior: 'smooth',
    });
  }
  //Scrolls right on the carousel.
  scrollRight() {
    this.scrollContainer.nativeElement.scrollTo({
      left: this.scrollContainer.nativeElement.scrollLeft + 300,
      behavior: 'smooth',
    });
  }
}
