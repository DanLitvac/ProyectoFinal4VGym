import { Component, OnInit } from '@angular/core';
import { NgbdDatepickerBasic } from "../date-picker/date-picker.component";
import { DateService } from '../servicies/month-year.service';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { TabsComponent } from "../tabs/tabs.component";

@Component({
    selector: 'app-page-body',
    standalone: true,
    templateUrl: './page-body.component.html',
    styleUrl: './page-body.component.scss',
    imports: [NgbdDatepickerBasic, CommonModule, NavBarComponent, TabsComponent]
})
export class PageBodyComponent implements OnInit {
    @ViewChild(NgbdDatepickerBasic) datepickerComponent!: NgbdDatepickerBasic;
    date!: Date;

    constructor(private dateService: DateService) {}
    
    ngOnInit() {
        this.dateService.currentDate.subscribe(date => {
            
            this.date = date;
            // Additional logging to debug
            console.log('Date updated:', this.date);
        });
    }

    onDateChange(newDate: Date) {
        this.date = newDate;
        console.log('Date updated:', this.date);
    }

    updateMonth(step: number) {
        if (this.datepickerComponent) {
            this.datepickerComponent.updateDate(step);
        }
    }
}
