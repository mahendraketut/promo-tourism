import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  video: any;
  carousel: any;
  backgroundImg: any;
  currentIndex: number = 0;

  //Set the video, carousel, and background image.
  constructor() {
    this.video = '/assets/video/Sequence 01.webm';
    this.backgroundImg = '/assets/img/imagecover3.jpg';
    this.carousel = [
      {
        img: '/assets/img/carousel1.jpg',
        title: 'New Collection 1',
        description: '',
      },
      {
        img: '/assets/img/imagecover.jpg',
        title: 'New Collection 2',
        description: '',
      },
      {
        img: '/assets/img/imagecover2.jpg',
        title: 'New Collection 3',
        description: '',
      },
    ];
  }

  ngOnInit(): void {
    //Automatically change carousel image every 3 seconds.
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carousel.length;
    }, 3000);
  }
}
