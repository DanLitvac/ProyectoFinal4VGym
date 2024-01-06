import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CardData {
  time?: string;
  date?: Date; 
  title?: CardTitle; 
  activityType?: ActivityType; 
  isFree: boolean;
  participants?: Participant[];
}
export interface Participant {
  name: string;
  email: string;
  phone: string;
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

  private participantsSource: BehaviorSubject<Participant[]> = new BehaviorSubject<Participant[]>([]);
  currentParticipants: Observable<Participant[]> = this.participantsSource.asObservable();

  private cards: CardData[] = [
    { time: "10:00 - 11:30", date: new Date("2023-11-21"), title: CardTitle.CitaOcupada, isFree: false, activityType: ActivityType.Spinning, participants: [{ name: "Miguel Goyena", email: "miguel@email.com", phone: "123456789" }] },
    { time: "13:30 - 15:00", date: new Date("2023-11-21"), title: CardTitle.TiempoLibre, isFree: true },
    { time: "17:30 - 19:00", date: new Date("2023-11-21"), title: CardTitle.CitaConMultiplesPersonas, isFree: false, activityType: ActivityType.BodyPump, participants: [{ name: "Miguel Goyena", email: "miguel@email.com", phone: "123456789" }, { name: "Lucia Rodriguez", email: "lucia@email.com", phone: "12343219" }] }
  ];

  constructor() { 
    this.cardsSource.next(this.cards);
    this.participantsSource.next(this.getAllParticipants());
  }

  getCard(): CardData[] {
    return this.cardsSource.getValue();
  }



  editCard(updatedCard: CardData) {
    const currentCards = this.getCard();
    const cardIndex = currentCards.findIndex(card => card.time === updatedCard.time);
    if (cardIndex !== -1) {
      
      currentCards[cardIndex] = updatedCard;
    }
    this.cardsSource.next(currentCards);
  }

  deleteCard(card: CardData) {
    const currentCards = this.getCard().filter(c => c !== card);
    card.isFree = true;
    card.participants = [];
    this.cardsSource.next([...currentCards, card]);
  }


  
  getAllParticipants(): Participant[] {
    const allParticipants = this.cardsSource.getValue()
      .map(card => card.participants || [])
      .reduce((acc, participants) => acc.concat(participants), []);

    // Filtrar participantes duplicados basados en un criterio (p. ej., email)
    const uniqueParticipants = allParticipants.filter((participant, index, self) =>
      index === self.findIndex(p => p.email === participant.email)
    );

    return uniqueParticipants;
  }

addParticipant(participant: Participant) {
  // Obtén la lista actual de participantes
  const currentParticipants = this.participantsSource.getValue();

  // Añade el nuevo participante
  const updatedParticipants = [...currentParticipants, participant];

  // Actualiza el BehaviorSubject
  this.participantsSource.next(updatedParticipants);
}
}
