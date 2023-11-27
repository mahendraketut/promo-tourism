import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterOfficerComponent } from './footer-officer.component';

describe('FooterOfficerComponent', () => {
  let component: FooterOfficerComponent;
  let fixture: ComponentFixture<FooterOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterOfficerComponent]
    });
    fixture = TestBed.createComponent(FooterOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
