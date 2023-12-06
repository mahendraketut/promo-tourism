import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinUsPageComponent } from './join-us-page.component';

describe('JoinUsPageComponent', () => {
  let component: JoinUsPageComponent;
  let fixture: ComponentFixture<JoinUsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinUsPageComponent]
    });
    fixture = TestBed.createComponent(JoinUsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
