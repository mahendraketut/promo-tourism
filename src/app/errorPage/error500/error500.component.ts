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
  }
  //Go back to previous page.
  goBack(): void {
    this.location.back();
  }
}
