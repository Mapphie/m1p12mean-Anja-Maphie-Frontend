import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Service } from './service.service';
import { User } from './user.service';
import { ClientVehicule } from './client-vehicule.service';
import { Devis } from './devis.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from './clients.service';
export interface InvoiceItem {
  service: Service;
  description?: string;
  remise: number;
  prixUnitaireHT: number;
  taxe: number;
  quantite: number;
  totalHT: number;
  totalTTC: number;
}

export enum StatutInvoice {
  BROUILLON = "Brouillon",
  CONFIRME = "Confirmée",
  PAYE = "Payée",
  ANNULE = "Annulée",
}

export interface Invoice {
  id?: string;
  number: string;
  devis?: Devis;
  client: Client;
  manager: User;
  vehicule: ClientVehicule;
  dateCreation: Date;
  totalHT: number;
  totalTTC: number;
  etat: string;
  lignes: InvoiceItem[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = environment.url + "invoice";
  private invoiceList = new BehaviorSubject<Invoice[]>([])

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<any> {
      return this.http.get(this.apiUrl);
    }

    getInvoiceById(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`)
    }


    addInvoice(quote: any): Observable<any> {
      const InvoiceToSend = this.prepareInvoiceForApi(quote)
      console.log(`${this.apiUrl}`)
      return this.http.post<any>(`${this.apiUrl}`, InvoiceToSend)
    }

    updateInvoice(id: string, quote: any): Observable<any> {
      const InvoiceToSend = this.prepareInvoiceForApi(quote)
      return this.http.put<any>(`${this.apiUrl}/${id}`, InvoiceToSend)
    }

    updateStateInvoice(id: string, statut: StatutInvoice): Observable<Invoice> {
      return this.http.put<Invoice>(`${this.apiUrl}/${id}/etat`, { etat: statut });
    }

    prepareInvoiceForApi(invoice: any): any {
      const prepared = { ...invoice }

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

      // Préparer chaque ligne de facture
      prepared.lignes = prepared.lignes.map((ligne: any) => {
        return {
          ...ligne,
          service: typeof ligne.service === 'object' ? (ligne.service._id || ligne.service) : ligne.service
        }
      })

      return prepared
    }

    getLastInvoice(): Observable<Invoice> {
        return this.http.get<Invoice>(`${this.apiUrl}/last`);
    }
}

