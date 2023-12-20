import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdDatepickerBasic } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: NgbdDatepickerBasic;
  let fixture: ComponentFixture<NgbdDatepickerBasic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbdDatepickerBasic]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgbdDatepickerBasic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
