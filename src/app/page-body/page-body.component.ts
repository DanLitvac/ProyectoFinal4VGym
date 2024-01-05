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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


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
            tipoActividad: ['', Validators.required],
            monitor1: ['', Validators.required],
            monitor2: ['']  
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
    
    // openEditModal(card: CardData, modalContent: any) {
    //     // Configura 'isBodyPumpSelected' en base a si el tipo de actividad es 'BodyPump'
    //     this.isBodyPumpSelected = card.activityType === 'BodyPump';
      
    //     // Configura el formulario con los valores de la tarjeta
    //     this.activityForm.patchValue({
    //       tipoActividad: card.activityType,
    //       monitor1: card.participants && card.participants.length > 0 ? card.participants[0] : '',
    //       monitor2: this.isBodyPumpSelected && card.participants && card.participants.length > 1 ? card.participants[1] : ''
          
    //     });
    //   console.log(card.participants);
    //     // Actualiza la validación del campo monitor2 en función de si la actividad es BodyPump
    //     if (this.isBodyPumpSelected) {
    //       this.activityForm.get('monitor2')?.setValidators(Validators.required);
    //     } else {
    //       this.activityForm.get('monitor2')?.clearValidators();
    //     }
    //     this.activityForm.get('monitor2')?.updateValueAndValidity();
      
    //     // Abre el modal
    //     this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title' });
    //   }

    openEditModal(card: CardData, modalContent: any) {
        this.isBodyPumpSelected = card.activityType === 'BodyPump';

        const monitor1 = card.participants!.length > 0 ? card.participants![0] : '';
        const monitor2 = this.isBodyPumpSelected && card.participants!?.length > 1 ? card.participants![1] : '';

        this.activityForm.patchValue({
            tipoActividad: card.activityType,
            monitor1: monitor1,
            monitor2: monitor2
        });

        this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
      



        
  
}
