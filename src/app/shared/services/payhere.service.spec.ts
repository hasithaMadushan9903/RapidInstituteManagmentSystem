import { TestBed } from '@angular/core/testing';

import { PayhereService } from './payhere.service';

describe('PayhereService', () => {
  let service: PayhereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayhereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
