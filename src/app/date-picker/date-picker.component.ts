import { Component, inject, ViewChild } from '@angular/core';
import { NgbDatepicker, NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { DateService } from '../servicies/month-year.service';
import { HostListener } from '@angular/core';


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

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            this.changeMonth(-1);
        } else if (event.key === 'ArrowRight') {
            this.changeMonth(1);
        }
    }

    public changeMonth(step: number) {
        let newMonth = this.date.month + step;
        let newYear = this.date.year;
    
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
    
        this.date = { year: newYear, month: newMonth };
        this.datepicker.navigateTo({ year: newYear, month: newMonth });
        this.dateService.changeDate(new Date(newYear, newMonth - 1, 1));
    }
    

}


