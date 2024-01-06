import { Component, OnDestroy, OnInit, ViewChild ,TemplateRef } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { TabsComponent } from "../tabs/tabs.component";
import { CardDataService, Participant } from '../servicies/input-data.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-monitores',
    standalone: true,
    templateUrl: './monitores.component.html',
    styleUrl: './monitores.component.scss',
    imports: [NavBarComponent, TabsComponent ,CommonModule ,ReactiveFormsModule , NgbModule]
})
export class MonitoresComponent implements OnInit , OnDestroy {
    @ViewChild('addParticipantModal') addParticipantModal!: TemplateRef<any>;
    participants: Participant[] = [];
    private destroy$: Subject<boolean> = new Subject<boolean>();

    participantForm!: FormGroup;

    constructor(private fb: FormBuilder, private modalService: NgbModal,private inputDataService: CardDataService) {}

    ngOnInit() {
        this.inputDataService.currentParticipants.pipe(takeUntil(this.destroy$)).subscribe(updatedParticipants => {
            this.participants = updatedParticipants;


            this.participantForm = this.fb.group({
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                phone: ['', Validators.required] });
        });

        // Cargar todos los participantes inicialmente
        this.participants = this.inputDataService.getAllParticipants();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    submitParticipant() {
        if (this.participantForm.valid) {
          this.inputDataService.addParticipant(this.participantForm.value);
          this.modalService.dismissAll();
        }
    }

    openAddParticipantModal() {
        this.modalService.open(this.addParticipantModal);
      }
}
