import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.css'],
})
export class Error500Component {
  constructor(private location: Location) {}

  ngOnInit() {
    // Additional logic for 500 error can be added here if needed
    console.log('500 Internal Server Error occurred');
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous URL in the browser's history
  }
}
