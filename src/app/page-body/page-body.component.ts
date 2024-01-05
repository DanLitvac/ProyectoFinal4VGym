import { Component, OnInit } from '@angular/core';
import { NgbdDatepickerBasic } from "../date-picker/date-picker.component";
import { DateService } from '../servicies/month-year.service';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { TabsComponent } from "../tabs/tabs.component";
import { CardData, CardDataService } from '../servicies/input-data.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
    cards: CardData[] = [];


      getCardIconClass(card: CardData): string {
        if (card.isFree) {
          return 'fas fa-plus-circle';
        }
        if (card.participants && card.participants.length > 1) {
          return 'fas fa-user-friends';
        }
        return 'fas fa-user';
      }

    constructor(private dateService: DateService , private inputDataService : CardDataService , private modalService: NgbModal) {}
    

    open(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      }


    
    private destroy$: Subject<boolean> = new Subject<boolean>();


    ngOnInit() {
        this.inputDataService.currentCards.pipe(takeUntil(this.destroy$)).subscribe(updatedCards => {
            this.cards = updatedCards;
          });

        this.dateService.currentDate.subscribe(date => {
            
            this.date = date;
            // Additional logging to debug
            console.log('Date updated:', this.date);
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
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

    deleteCard(card: CardData) {
        this.inputDataService.deleteCard(card);
    }
    
}
