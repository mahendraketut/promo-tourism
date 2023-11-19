import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavOfficerComponent } from './sidenav-officer.component';

describe('SidenavOfficerComponent', () => {
  let component: SidenavOfficerComponent;
  let fixture: ComponentFixture<SidenavOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavOfficerComponent]
    });
    fixture = TestBed.createComponent(SidenavOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
