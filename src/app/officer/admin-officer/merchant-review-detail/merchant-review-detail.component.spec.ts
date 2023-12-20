import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantReviewDetailComponent } from './merchant-review-detail.component';

describe('MerchantReviewDetailComponent', () => {
  let component: MerchantReviewDetailComponent;
  let fixture: ComponentFixture<MerchantReviewDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantReviewDetailComponent]
    });
    fixture = TestBed.createComponent(MerchantReviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
