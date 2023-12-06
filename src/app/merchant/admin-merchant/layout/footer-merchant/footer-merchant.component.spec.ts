import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMerchantComponent } from './footer-merchant.component';

describe('FooterMerchantComponent', () => {
  let component: FooterMerchantComponent;
  let fixture: ComponentFixture<FooterMerchantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterMerchantComponent]
    });
    fixture = TestBed.createComponent(FooterMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
