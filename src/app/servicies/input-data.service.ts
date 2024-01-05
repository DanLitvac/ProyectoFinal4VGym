import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CardData {
  time: string;
  date: Date; 
  title: CardTitle; 
  activityType?: ActivityType; 
  isFree: boolean;
  participants?: string[]; 
}
export enum ActivityType {
  Pilates = "Pilates",
  Spinning = "Spinning",
  BodyPump = "BodyPump"
}

export enum CardTitle {
  CitaOcupada = "Cita Ocupada",
  TiempoLibre = "Tiempo Libre",
  CitaConMultiplesPersonas = "Cita con Múltiples Personas"
}

@Injectable({
  providedIn: 'root'
})
export class CardDataService {
  private cardsSource: BehaviorSubject<CardData[]> = new BehaviorSubject<CardData[]>([]);
  currentCards: Observable<CardData[]> = this.cardsSource.asObservable();


  private cards: CardData[] = [
    { time: "10:00 - 11:30", date: new Date("2023-11-21"), title: CardTitle.CitaOcupada, isFree: false, activityType: ActivityType.BodyPump, participants: ["Miguel Goyena"] },
    { time: "13:30 - 15:00", date: new Date("2023-11-21"), title: CardTitle.TiempoLibre, isFree: true },
    { time: "17:30 - 19:00", date: new Date("2023-11-21"), title: CardTitle.CitaConMultiplesPersonas, isFree: false, activityType: ActivityType.Spinning, participants: ["Miguel Goyena", "Lucia Rodriguez"] }
  ];

  constructor() { 
    this.cardsSource.next(this.cards);
  }

  getCard(): CardData[] {
    return this.cardsSource.getValue();
  }

  addCard(card: CardData) {
    const currentCards = this.getCard();
    this.cardsSource.next([...currentCards, card]);
  }

  deleteCard(card: CardData) {
    const currentCards = this.getCard().filter(c => c !== card);
    card.isFree = true;
    card.participants = [];
    this.cardsSource.next([...currentCards, card]);
  }
}
