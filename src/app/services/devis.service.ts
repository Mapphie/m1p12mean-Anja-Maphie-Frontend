import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client } from './clients.service';
import { Service } from './service.service';


export enum StatutDevis {
  BROUILLON = "Brouillon",
  CONFIRME = "Confirmé",
  FACTURE = "Facturé",
  ANNULE = "Annulé",
}

export interface Devis {
    numero: string;
    client: string; // ID de l'utilisateur (ObjectId)
    manager: string; // ID du manager (ObjectId)
    vehicule: string; // ID du véhicule (ObjectId)
    dateCreation: Date;
    totalHT: number;
    totalTTC: number;
    facture?: string | null;
    etat: string;
    lignes: LigneDevis[];
  }

  export interface LigneDevis {
    reference: string;
    service: string;
    description?: string;
    remise: number;
    prixUnitaireHT: number;
    taxe: number;
    quantite: number;
    totalHT: number;
    totalTTC: number;
  }

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = environment.url + "adminDevis";
  private devisList = new BehaviorSubject<Devis[]>([])
  devis$ = this.devisList.asObservable()

  // Données de test

  constructor(private http: HttpClient) {
  }

  getDevis(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getDevisById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }


  ajouterDevis(quote: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, quote)
  }

  mettreAJourDevis(id: string, quote: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, quote)
  }

  changerStatutDevis(id: string, statut: StatutDevis): Observable<Devis> {
    return this.http.put<Devis>(`${this.apiUrl}/${id}/statut`, { etat: statut });
  }

}

