import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavMerchantComponent } from './sidenav-merchant.component';

describe('SidenavMerchantComponent', () => {
  let component: SidenavMerchantComponent;
  let fixture: ComponentFixture<SidenavMerchantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavMerchantComponent]
    });
    fixture = TestBed.createComponent(SidenavMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
