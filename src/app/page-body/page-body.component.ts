import { Component, OnInit } from '@angular/core';
import { NgbdDatepickerBasic } from "../date-picker/date-picker.component";
import { DateService } from '../servicies/month-year.service';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { TabsComponent } from "../tabs/tabs.component";
import { CardData, CardDataService, Participant } from '../servicies/input-data.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { get } from 'http';


@Component({
    selector: 'app-page-body',
    standalone: true,
    templateUrl: './page-body.component.html',
    styleUrl: './page-body.component.scss',
    imports: [NgbdDatepickerBasic, CommonModule, NavBarComponent, TabsComponent, ReactiveFormsModule]
})

export class PageBodyComponent implements OnInit {
    @ViewChild(NgbdDatepickerBasic) datepickerComponent!: NgbdDatepickerBasic;
   
   
    activityForm!: FormGroup;
    isBodyPumpSelected: boolean = false;


    date!: Date;
    cards: CardData[] = [];

    participants: Participant[] = [];

      getCardIconClass(card: CardData): string {
        if (card.isFree) {
          return 'fas fa-plus-circle';
        }
        if (card.participants && card.participants.length > 1) {
          return 'fas fa-user-friends';
        }
        return 'fas fa-user';
      }

    constructor(private dateService: DateService , private inputDataService : CardDataService , private modalService: NgbModal,private fb: FormBuilder) {}
    

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


        this.activityForm = this.fb.group({
            hora: ['', Validators.required],
            tipoActividad: ['', Validators.required],
            monitor1: [null, Validators.required], 
            monitor2: [null]
         });
      
          // Reaccionar a cambios en el campo de actividad
          this.activityForm.get('tipoActividad')?.valueChanges.subscribe(value => {
            this.isBodyPumpSelected = value === 'BodyPump';
            if (!this.isBodyPumpSelected) {
              this.activityForm.get('monitor2')?.reset();
              this.activityForm.get('monitor2')?.clearValidators();
            } else {
              this.activityForm.get('monitor2')?.setValidators(Validators.required);
            }
            this.activityForm.get('monitor2')?.updateValueAndValidity();
          });


      

          this.participants = this.inputDataService.getAllParticipants();
          console.log(this.participants); // Para depuración
    
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
      }

      onDateChange(newDate: Date) {
        this.date = newDate;
        this.filterCardsForToday(); // Asegúrate de llamar a este método aquí
        console.log('Date updated:', this.date);
      }

    get hasCardsForToday(): boolean {
    return this.cards.some(card => this.isToday(card.date));
  }

  isToday(cardDate?: Date): boolean {
    if (!cardDate) {
      return false; // Si cardDate es undefined, retorna false
    }
    const today = new Date(this.getDate());
    const dateToCheck = new Date(cardDate);
    return dateToCheck.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  }
  

  cardsForToday: CardData[] = [];

  filterCardsForToday() {
    const today = new Date(this.getDate());
    today.setHours(0, 0, 0, 0);
  
    this.cardsForToday = this.cards.filter(card => {
      if (!card.date) {
        return false; // Si card.date es undefined, excluye la tarjeta
      }
      const cardDate = new Date(card.date);
      cardDate.setHours(0, 0, 0, 0);
      return cardDate.getTime() === today.getTime();
    });
  }
  



  generateFreeCards(count: number): CardData[] {
    const timeSlots = [
      '10:00 - 11:30',
      '13:30 - 15:00',
      '17:30 - 19:00'
    ];
  
    return Array.from({ length: count }, (_, index) => ({
      isFree: true,
      time: timeSlots[index % timeSlots.length],
    }));
  }
  





    getDate(): Date {
        return this.date;
    }
    updateMonth(step: number) {
        if (this.datepickerComponent) {
            this.datepickerComponent.updateDate(step);
        }
        console.log('Date updated:', this.getDate());
    }

    deleteCard(card: CardData) {
        this.inputDataService.deleteCard(card);
    }
    
    saveCard() {
      if (this.activityForm.valid) {
        const updatedCard: CardData = {
          time: this.activityForm.value.hora,
          activityType: this.activityForm.value.tipoActividad,
          isFree: false,
          participants: [this.activityForm.value.monitor1, this.activityForm.value.monitor2].filter(p => !!p)
          // Asegúrate de que monitor1 y monitor2 contienen los objetos Participant completos
        };
        this.inputDataService.editCard(updatedCard);
        this.modalService.dismissAll();
      }
    }
    
      

    openEditModal(card: CardData, modalContent: any) {
      this.isBodyPumpSelected = card.activityType === 'BodyPump';
    
      // Encuentra los objetos Participant completos basados en el nombre
      const monitor1 = this.participants.find(p => p.name === card.participants![0].name);
      const monitor2 = this.isBodyPumpSelected && card.participants!.length > 1 
                      ? this.participants.find(p => p.name === card.participants![1].name)
                      : null;
    
      this.activityForm.patchValue({
        hora: card.time,
        tipoActividad: card.activityType,
        monitor1: monitor1,  // Asigna el objeto completo
        monitor2: monitor2   // Asigna el objeto completo o null
      });
    
      this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
    

    openModal(card: CardData, modalContent: any) {
        this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title' });
        this.activityForm.reset();
        this.activityForm.patchValue({
            hora: card.time,
        });
    }
      

    getParticipantNames(card: CardData): string {
      if (card.isFree) {
        return 'FREE';
      }
  
      return card.participants && card.participants.length > 0
        ? card.participants.map(p => p.name).join(', ')
        : 'No Participants';
    }



        
  
}
