import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMerchantComponent } from './navbar-merchant.component';

describe('NavbarMerchantComponent', () => {
  let component: NavbarMerchantComponent;
  let fixture: ComponentFixture<NavbarMerchantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarMerchantComponent]
    });
    fixture = TestBed.createComponent(NavbarMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
