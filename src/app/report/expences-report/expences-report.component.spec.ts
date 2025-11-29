import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpencesReportComponent } from './expences-report.component';

describe('ExpencesReportComponent', () => {
  let component: ExpencesReportComponent;
  let fixture: ComponentFixture<ExpencesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpencesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpencesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
