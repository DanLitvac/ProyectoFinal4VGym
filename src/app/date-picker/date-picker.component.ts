import { Component, inject, ViewChild } from '@angular/core';
import { NgbDatepicker, NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { DateService } from '../servicies/month-year.service';

@Component({
    selector: 'ngbd-datepicker-basic',
    standalone: true,
    imports: [NgbDatepickerModule, FormsModule, JsonPipe],
    templateUrl: './date-picker.component.html',
})
export class NgbdDatepickerBasic {
    @ViewChild('dp') datepicker!: NgbDatepicker;
    today = inject(NgbCalendar).getToday();
    model: NgbDateStruct = this.today;
    date: { year: number; month: number } = { year: this.today.year, month: this.today.month }; 

    constructor(private dateService: DateService) {}

    onNavigate(event: any) {

        let newDate = new Date(event.next.year, event.next.month - 1, 1);
        this.dateService.changeDate(newDate);
    }

}
