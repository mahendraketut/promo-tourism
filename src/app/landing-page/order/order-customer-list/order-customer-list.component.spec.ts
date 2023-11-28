import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCustomerListComponent } from './order-customer-list.component';

describe('OrderCustomerListComponent', () => {
  let component: OrderCustomerListComponent;
  let fixture: ComponentFixture<OrderCustomerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderCustomerListComponent]
    });
    fixture = TestBed.createComponent(OrderCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
