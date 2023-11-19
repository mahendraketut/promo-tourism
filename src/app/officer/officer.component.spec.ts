import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerComponent } from './officer.component';

describe('OfficerComponent', () => {
  let component: OfficerComponent;
  let fixture: ComponentFixture<OfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfficerComponent]
    });
    fixture = TestBed.createComponent(OfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
