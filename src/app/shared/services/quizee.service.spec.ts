import { TestBed } from '@angular/core/testing';

import { QuizeeService } from './quizee.service';

describe('QuizeeService', () => {
  let service: QuizeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
