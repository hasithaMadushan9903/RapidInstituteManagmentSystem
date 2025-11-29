import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuizReportComponent } from './manage-quiz-report.component';

describe('ManageQuizReportComponent', () => {
  let component: ManageQuizReportComponent;
  let fixture: ComponentFixture<ManageQuizReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageQuizReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageQuizReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
