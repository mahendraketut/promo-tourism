import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMerchantComponent } from './report-merchant.component';

describe('ReportMerchantComponent', () => {
  let component: ReportMerchantComponent;
  let fixture: ComponentFixture<ReportMerchantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportMerchantComponent]
    });
    fixture = TestBed.createComponent(ReportMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
