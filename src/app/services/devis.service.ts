import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service } from './service.service';
import { User } from './user.service';
import { ClientVehicule } from './client-vehicule.service';


export enum StatutDevis {
  BROUILLON = "Brouillon",
  CONFIRME = "Confirmé",
  FACTURE = "Facturé",
  ANNULE = "Annulé",
}

export interface Devis {
    _id?: string
    numero: string;
    client: User; 
    manager: User;
    vehicule: ClientVehicule; 
    dateCreation: Date;
    totalHT: number;
    totalTTC: number;
    facture?: string | null;
    etat: string;
    lignes: LigneDevis[];
  }

  export interface LigneDevis {
    service: Service;
    description?: string;
    remise: number;
    prixUnitaireHT: number;
    taxe: number;
    quantite: number;
    // totalHT: number;
    totalTTC: number;
  }

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = environment.url + "adminDevis";
  private devisList = new BehaviorSubject<Devis[]>([])

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
    const quoteToSend = this.prepareDevisForApi(quote)
    return this.http.post<any>(this.apiUrl, quoteToSend)
  }

  mettreAJourDevis(id: string, quote: any): Observable<any> {
    const quoteToSend = this.prepareDevisForApi(quote)
    return this.http.put<any>(`${this.apiUrl}/${id}`, quoteToSend)
  }

  changerStatutDevis(id: string, statut: StatutDevis): Observable<Devis> {
    return this.http.put<Devis>(`${this.apiUrl}/${id}/etat`, { etat: statut });
  }

  private prepareDevisForApi(devis: any): any {
    const prepared = { ...devis }

    // Extraire juste l'ID du client
    if (prepared.client && typeof prepared.client === 'object') {
      prepared.client = prepared.client._id || prepared.client
    }

    // Manager est null ou un objet → mettre uniquement l’ID si présent
    if (prepared.manager && typeof prepared.manager === 'object') {
      prepared.manager = prepared.manager._id || prepared.manager
    }

    // Extraire l'ID du véhicule
    if (prepared.vehicule && typeof prepared.vehicule === 'object') {
      prepared.vehicule = prepared.vehicule._id || prepared.vehicule
    }

    // Préparer chaque ligne de devis
    prepared.lignes = prepared.lignes.map((ligne: any) => {
      return {
        ...ligne,
        service: typeof ligne.service === 'object' ? (ligne.service._id || ligne.service) : ligne.service
      }
    })

    return prepared
  }


}

