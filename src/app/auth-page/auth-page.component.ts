import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
})
export class AuthPageComponent {
  @ViewChild('videoElement') videoElement: ElementRef;
  cover: any;
  video: any;

  constructor() {
    this.cover = '/assets/img/cover_2.jpg';
    this.video = '/assets/video/covervideo4.mp4';
  }

  ngOnInit(): void {
  }
}
