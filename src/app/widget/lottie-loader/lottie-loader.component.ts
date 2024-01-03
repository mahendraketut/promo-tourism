import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import lottie from 'lottie-web';

@Component({
  selector: 'app-lottie-loader',
  template: '<div #lottieContainer style="width: 100px; height: 100px;"></div>',
})
export class LottieLoaderComponent implements AfterViewInit {
  @ViewChild('lottieContainer') lottieContainer: ElementRef;

  ngAfterViewInit() {
    lottie.loadAnimation({
      container: this.lottieContainer.nativeElement, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/lottie/logo.json', // the path to the animation json
    });
  }
}
