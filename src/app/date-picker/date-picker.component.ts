import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
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
    date: { year: number; month: number; day: number } = { 
        year: this.today.year, 
        month: this.today.month, 
        day: this.today.day 
    }; 

    constructor(private dateService: DateService) {}

    public onDateSelect(date: NgbDateStruct) {
        // Update the date, month, and year based on the selected date
        this.date = { year: date.year, month: date.month, day: date.day };
        this.dateService.changeDate(new Date(date.year, date.month - 1, date.day));
    }

    onNavigate(event: any) {
        if (event.next) {
            let newYear = event.next.year;
            let newMonth = event.next.month;
            let newDay = new Date(newYear, newMonth - 1, this.date.day).getDate();

            // Check if the new day is outside the range of the new month
            if (newDay > new Date(newYear, newMonth, 0).getDate()) {
                newDay = new Date(newYear, newMonth, 0).getDate();
            }

            this.date = { year: newYear, month: newMonth, day: newDay };
            this.dateService.changeDate(new Date(newYear, newMonth - 1, newDay));
        }
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            this.updateDate(-1);
        } else if (event.key === 'ArrowRight') {
            this.updateDate(1);
        }
    }

    @Output() dateChanged = new EventEmitter<Date>();

   public updateDate(step: number) {
    let newDate = new Date(this.model.year, this.model.month - 1, this.model.day + step);
    
    // Asegúrate de que la fecha está dentro de los límites válidos
    if (newDate.getMonth() !== this.model.month - 1) {
        if (step > 0) {
            newDate = new Date(this.model.year, this.model.month, 0); // Último día del mes
        } else {
            newDate = new Date(this.model.year, this.model.month - 2, 1); // Primer día del mes anterior
        }
    }

    this.model = { year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate() };
    this.date = { year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate() };
    this.datepicker.navigateTo({ year: this.model.year, month: this.model.month });

    this.dateChanged.emit(new Date(this.model.year, this.model.month - 1, this.model.day));
}

    
}
