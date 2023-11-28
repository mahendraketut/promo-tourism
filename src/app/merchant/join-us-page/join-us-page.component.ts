import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-join-us-page',
  templateUrl: './join-us-page.component.html',
  styleUrls: ['./join-us-page.component.css'],
})
export class JoinUsPageComponent {
  image: any = 'assets/img/Mesa de trabajo 1.svg';
  tourismMalaysiaLogo: any = 'assets/img/tourismMalaysia.png';
  promoTourismLogo: any = 'assets/img/logo-landscape.png';
  seller: string = 'assets/img/seller.png';

  constructor(private viewportScroller: ViewportScroller) {}

  smoothScroll(elementId: string): void {
    let scroll = document.getElementById('registerMerchant');
    scroll?.scrollIntoView({ behavior: 'smooth' });
    // this.viewportScroller.scrollToAnchor(elementId);

    // if (element) {
    //   this.viewportScroller.scrollToAnchor(elementId);
    // }
  }
}
