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
    this.cover = '/assets/img/imagecover3.jpg';
    this.video = '/assets/video/covervideo4.mp4';
  }

  ngOnInit(): void {
    // Get a reference to the video element
    // const video: HTMLVideoElement = this.videoElement.nativeElement;

    // Add an event listener to reset the video when the page is loaded
    // video.addEventListener('loadedmetadata', () => {
    //   video.currentTime = 0;
    // });
  }
}
