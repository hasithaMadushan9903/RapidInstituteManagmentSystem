import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuizReportComponent } from './student-quiz-report.component';

describe('StudentQuizReportComponent', () => {
  let component: StudentQuizReportComponent;
  let fixture: ComponentFixture<StudentQuizReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentQuizReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQuizReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
