import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacehrQuizReportComponent } from './teacehr-quiz-report.component';

describe('TeacehrQuizReportComponent', () => {
  let component: TeacehrQuizReportComponent;
  let fixture: ComponentFixture<TeacehrQuizReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacehrQuizReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacehrQuizReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
