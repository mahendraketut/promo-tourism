import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarOfficerComponent } from './navbar-officer.component';

describe('NavbarOfficerComponent', () => {
  let component: NavbarOfficerComponent;
  let fixture: ComponentFixture<NavbarOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarOfficerComponent]
    });
    fixture = TestBed.createComponent(NavbarOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
