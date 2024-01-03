import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottieLoaderComponent } from './lottie-loader.component';

describe('LottieLoaderComponent', () => {
  let component: LottieLoaderComponent;
  let fixture: ComponentFixture<LottieLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LottieLoaderComponent]
    });
    fixture = TestBed.createComponent(LottieLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
