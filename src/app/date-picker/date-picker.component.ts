import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-datepicker-basic',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './date-picker.component.html',
})
export class NgbdDatepickerBasic {
	today = inject(NgbCalendar).getToday();

  model: NgbDateStruct = this.today; 
	date: { year: number; month: number } = { year: this.today.year, month: this.today.month }; 
}