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

  constructor() {
    this.video = '/assets/video/Sequence 01.webm';
    this.backgroundImg = '/assets/img/imagecover3.jpg';
    this.carousel = [
      {
        img: '/assets/img/carousel1.jpg',
        title: 'New Collection 1',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      },
      {
        img: '/assets/img/imagecover.jpg',
        title: 'New Collection 2',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      },
      {
        img: '/assets/img/imagecover2.jpg',
        title: 'New Collection 3',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      },
    ];
  }

  ngOnInit(): void {
    // Automatically change the active image in the carousel
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.carousel.length;
    }, 3000); // Change image every 3 seconds (3000 milliseconds)
  }
}
