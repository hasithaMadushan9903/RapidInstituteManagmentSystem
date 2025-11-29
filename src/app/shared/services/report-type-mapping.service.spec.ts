import { TestBed } from '@angular/core/testing';

import { ReportTypeMappingService } from './report-type-mapping.service';

describe('ReportTypeMappingService', () => {
  let service: ReportTypeMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportTypeMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
