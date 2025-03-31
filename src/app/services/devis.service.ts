import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface LigneDevis {
  reference: string
  article: string
  description: string
  remise: number
  prixUnitaireHT: number
  taxe: number
  quantite: number
  totalTTC: number
}

export interface Article {
  reference: string
  designation: string
  prixUnitaire: number
  taxe: number
}

export interface VehiculeInfo {
  immatriculation: string
  marque: string
  modele: string
  kilometrage: number
}

export interface Client {
  id: number
  nom: string
}

export enum StatutDevis {
  BROUILLON = "Brouillon",
  CONFIRME = "Confirmé",
  FACTURE = "Facturé",
  ANNULE = "Annulé",
}

export interface Devis {
  id: number
  numero: string
  client: Client
  dateCreation: Date
  datePrevue: Date | null
  manager: string | null
  facture: string | null
  total: number
  etat: StatutDevis
  conditionPaiement: string
  adresseFacturation: string
  vehiculeInfo?: VehiculeInfo
  lignes: LigneDevis[]
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private devisUrl = "api/devis" // URL vers l'API
  private devisList = new BehaviorSubject<Devis[]>([])
  devis$ = this.devisList.asObservable()

  // Données de test
  private mockDevis: Devis[] = [
      {
        id: 1,
        numero: 'D-20240301',
        client: { id: 101, nom: 'Jean Dupont' },
        dateCreation: new Date('2024-03-01'),
        datePrevue: new Date('2024-03-10'),
        manager: 'Alice Martin',
        facture: 'F-20240301',
        total: 1250.50,
        etat: StatutDevis.FACTURE,
        conditionPaiement: '30 jours',
        adresseFacturation: '12 rue des Lilas, Paris',
        vehiculeInfo: { immatriculation: 'AB-123-CD', marque: 'Renault', kilometrage: 120000, modele: 'Clio' },
        lignes: [
          { reference: 'P001', article: 'Plaquettes de frein', description: 'Plaquettes avant', remise: 5, prixUnitaireHT: 50, taxe: 20, quantite: 2, totalTTC: 120 },
          { reference: 'P002', article: 'Huile moteur', description: '5W30 synthétique', remise: 0, prixUnitaireHT: 40, taxe: 20, quantite: 1, totalTTC: 48 }
        ]
      },
      {
        id: 2,
        numero: 'D-20240302',
        client: {id: 102, nom: 'Marie Curie' },
        dateCreation: new Date('2024-03-02'),
        datePrevue: new Date('2024-03-15'),
        manager: 'Bob Durand',
        facture: null,
        total: 800.75,
        etat: StatutDevis.BROUILLON,
        conditionPaiement: 'À réception',
        adresseFacturation: '34 avenue des Champs, Lyon',
        vehiculeInfo: { immatriculation: 'XY-987-ZT', marque: 'Peugeot', kilometrage: 85000, modele: '308' },
        lignes: [
          { reference: 'P003', article: 'Batterie', description: '12V 70Ah', remise: 10, prixUnitaireHT: 150, taxe: 20, quantite: 1, totalTTC: 180 }
        ]
      },
      {
        id: 3,
        numero: 'D-20240303',
        client: {id: 103, nom: 'Paul Verlaine' },
        dateCreation: new Date('2024-03-03'),
        datePrevue: null,
        manager: 'Alice Martin',
        facture: 'F-20240303',
        total: 2200.00,
        etat: StatutDevis.FACTURE,
        conditionPaiement: '45 jours',
        adresseFacturation: '78 boulevard Saint-Michel, Marseille',
        vehiculeInfo: { immatriculation: 'LM-456-NO', marque: 'BMW', kilometrage: 60000, modele: 'X5' },
        lignes: [
          { reference: 'P004', article: 'Pneus hiver', description: 'Michelin Alpin 225/45R17', remise: 0, prixUnitaireHT: 250, taxe: 20, quantite: 4, totalTTC: 1200 },
          { reference: 'P005', article: 'Disques de frein', description: 'Avant et arrière', remise: 5, prixUnitaireHT: 100, taxe: 20, quantite: 2, totalTTC: 240 }
        ]
      },
      {
        id: 4,
        numero: 'D-20240304',
        client: {id: 104, nom: 'Victor Hugo' },
        dateCreation: new Date('2024-03-04'),
        datePrevue: new Date('2024-03-12'),
        manager: null,
        facture: null,
        total: 530.00,
        etat: StatutDevis.CONFIRME,
        conditionPaiement: 'À la commande',
        adresseFacturation: '56 rue Voltaire, Toulouse',
        lignes: [
          { reference: 'P006', article: 'Courroie de distribution', description: 'Kit complet', remise: 0, prixUnitaireHT: 200, taxe: 20, quantite: 1, totalTTC: 240 },
          { reference: 'P007', article: 'Filtre à air', description: 'Bosch', remise: 0, prixUnitaireHT: 50, taxe: 20, quantite: 1, totalTTC: 60 }
        ]
      },
      {
        id: 5,
        numero: 'D-20240305',
        client: {id: 105, nom: 'Émile Zola' },
        dateCreation: new Date('2024-03-05'),
        datePrevue: new Date('2024-03-20'),
        manager: 'Bob Durand',
        facture: 'F-20240305',
        total: 1450.30,
        etat: StatutDevis.FACTURE,
        conditionPaiement: '30 jours',
        adresseFacturation: '23 place Bellecour, Lyon',
        vehiculeInfo: { immatriculation: 'QR-789-ST', marque: 'Mercedes', kilometrage: 40000, modele: 'Classe A' },
        lignes: [
          { reference: 'P008', article: 'Échappement', description: 'Silencieux arrière', remise: 10, prixUnitaireHT: 350, taxe: 20, quantite: 1, totalTTC: 378 },
          { reference: 'P009', article: 'Liquide de frein', description: 'DOT 4', remise: 0, prixUnitaireHT: 30, taxe: 20, quantite: 2, totalTTC: 72 }
        ]
      },
      {
        id: 6,
        numero: 'D-20240306',
        client: {id: 106, nom: 'Charles Baudelaire' },
        dateCreation: new Date('2024-03-06'),
        datePrevue: null,
        manager: null,
        facture: null,
        total: 390.00,
        etat: StatutDevis.BROUILLON,
        conditionPaiement: 'À réception',
        adresseFacturation: '10 rue Lafayette, Bordeaux',
        lignes: [
          { reference: 'P010', article: 'Ampoules LED', description: 'H7 6000K', remise: 5, prixUnitaireHT: 40, taxe: 20, quantite: 2, totalTTC: 96 },
          { reference: 'P011', article: 'Balais d’essuie-glace', description: 'Bosch AeroTwin', remise: 0, prixUnitaireHT: 25, taxe: 20, quantite: 2, totalTTC: 60 }
        ]
      }
    ];
  

  constructor(private http: HttpClient) {
    this.devisList.next(this.mockDevis)
  }

  getDevis(): Observable<Devis[]> {
    return this.devis$
  }

  getDevisById(numero: string): Observable<Devis | undefined> {
    return of(this.mockDevis.find((devis) => devis.numero === numero))
  }

  ajouterDevis(devis: Omit<Devis, "id" | "numero">): Observable<Devis> {
    const newDevis: Devis = {
      ...devis,
      id: this.getNextId(),
      numero: this.getNextNumero(),
    }

    this.mockDevis.push(newDevis)
    this.devisList.next([...this.mockDevis])
    return of(newDevis)
  }

  mettreAJourDevis(devis: Devis): Observable<Devis> {
    const index = this.mockDevis.findIndex((d) => d.numero === devis.numero)
    if (index !== -1) {
      this.mockDevis[index] = devis
      this.devisList.next([...this.mockDevis])
    }
    return of(devis)
  }

  changerStatutDevis(numero: string, statut: StatutDevis): Observable<Devis | undefined> {
    const devis = this.mockDevis.find((d) => d.numero === numero)
    if (devis) {
      devis.etat = statut
      this.devisList.next([...this.mockDevis])
    }
    return of(devis)
  }

  private getNextId(): number {
    return Math.max(...this.mockDevis.map((d) => d.id), 0) + 1
  }

  private getNextNumero(): string {
    const nextNum = Math.max(...this.mockDevis.map((d) => Number.parseInt(d.numero, 10)), 0) + 1
    return nextNum.toString().padStart(5, "0")
  }

  getClients(): Observable<Client[]> {
    return of([
      { id: 1, nom: "Cet Content 1" },
      { id: 2, nom: "Cet content 2" },
      { id: 3, nom: "Autre Client" },
    ])
  }

  getArticles(): Observable<Article[]> {
    return of([
      { reference: "ART001", designation: "Pièce moteur", prixUnitaire: 150, taxe: 20 },
      { reference: "ART002", designation: "Huile moteur", prixUnitaire: 45, taxe: 20 },
      { reference: "ART003", designation: "Filtre à air", prixUnitaire: 25, taxe: 20 },
    ])
  }
}

