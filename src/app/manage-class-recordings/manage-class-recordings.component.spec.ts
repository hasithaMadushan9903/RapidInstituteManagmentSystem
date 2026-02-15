import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClassRecordingsComponent } from './manage-class-recordings.component';

describe('ManageClassRecordingsComponent', () => {
  let component: ManageClassRecordingsComponent;
  let fixture: ComponentFixture<ManageClassRecordingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClassRecordingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClassRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
