import { TestBed } from '@angular/core/testing';

import { TempProductService } from './temp-product.service';

describe('TempProductService', () => {
  let service: TempProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
