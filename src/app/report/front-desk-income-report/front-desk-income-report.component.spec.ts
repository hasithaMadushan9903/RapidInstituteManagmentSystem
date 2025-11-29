import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskIncomeReportComponent } from './front-desk-income-report.component';

describe('FrontDeskIncomeReportComponent', () => {
  let component: FrontDeskIncomeReportComponent;
  let fixture: ComponentFixture<FrontDeskIncomeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrontDeskIncomeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontDeskIncomeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
