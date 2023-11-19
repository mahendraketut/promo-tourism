import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOfficerComponent } from './report-officer.component';

describe('ReportOfficerComponent', () => {
  let component: ReportOfficerComponent;
  let fixture: ComponentFixture<ReportOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportOfficerComponent]
    });
    fixture = TestBed.createComponent(ReportOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
