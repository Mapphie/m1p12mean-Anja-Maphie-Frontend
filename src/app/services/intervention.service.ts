import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service } from './service.service';
import { Client } from './clients.service';
import { ClientVehicule } from './client-vehicule.service';
import { User } from './user.service';

export interface Intervention {
    id: number;
    service: Service;
    client: Client;
    vehicule: ClientVehicule;
    dateDemande: Date;
    dateDebut: Date;
    dureeEstimee: number;
    dateFin: Date | null;
    mecanicien: User;
    coutEstime: number;
    status: 'En cours' | 'Fini' | 'En attente';
  }

  export interface InterventionStats {
    total: number;
    enCours: number;
    fini: number;
    enAttente: number;
  }

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
    private apiUrl = environment.url + "intervention";


    constructor(private http: HttpClient) {}

    getInterventions(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    getInterventionStats(): Observable<InterventionStats> {
        return this.getInterventions().pipe(
            map((response: any) => {
              const interventions = Array.isArray(response) ? response : response.data || [];
              const total = interventions.length;
              const enCours = interventions.filter((i: Intervention) => i.status === 'En cours').length;
              const fini = interventions.filter((i: Intervention) => i.status === 'Fini').length;
              const enAttente = interventions.filter((i: Intervention) => i.status === 'En attente').length;

              return { total, enCours, fini, enAttente };
            })
        );
    }

    getInterventionById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`)
    }

    addIntervention(intervention: any): Observable<any> {
        const interventionToSend = this.prepareInterventionForApi(intervention)
        return this.http.post<any>(this.apiUrl, interventionToSend)

    }

    updateIntervention(id: number, intervention: any): Observable<any> {
        const interventionToSend = this.prepareInterventionForApi(intervention)
        return this.http.put<any>(`${this.apiUrl}/${id}`, interventionToSend)
    }


    private prepareInterventionForApi(devis: any): any {
        const prepared = { ...devis }

        // Extraire juste l'ID du client
        if (prepared.client && typeof prepared.client === 'object') {
          prepared.client = prepared.client._id || prepared.client
        }

        if (prepared.mecanicien && typeof prepared.mecanicien === 'object') {
          prepared.mecanicien = prepared.mecanicien._id || prepared.mecanicien
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
