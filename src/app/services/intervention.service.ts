import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

export interface Intervention {
    id: number;
    type: string;
    client: string;
    vehicule: string;
    dateDemande: Date;
    dateDebut: Date;
    dureeEstimee: string;
    dateFin: Date | null;
    mecanicien: string;
    coutEstime: number;
    coutFinal: number | null;
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
    private interventions: Intervention[] = [
        {
          id: 1,
          type: 'Réparation',
          client: 'Jean Dupont',
          vehicule: 'Renault Clio',
          dateDemande: new Date('2025-03-15'),
          dateDebut: new Date('2025-03-18'),
          dureeEstimee: '2 jours',
          dateFin: new Date('2025-03-20'),
          mecanicien: 'Pierre Martin',
          coutEstime: 350,
          coutFinal: 380,
          status: 'Fini'
        },
        // Ajoutez d'autres interventions pour tester
      ];

      private interventionsSubject = new BehaviorSubject<Intervention[]>(this.interventions);

      constructor(private http: HttpClient) {}

      getInterventions(): Observable<Intervention[]> {
        // Dans un cas réel, vous feriez un appel HTTP
        // return this.http.get<Intervention[]>('api/interventions');
        return this.interventionsSubject.asObservable();
      }

      getInterventionStats(): Observable<InterventionStats> {
        return this.getInterventions().pipe(
          map(interventions => {
            const total = interventions.length;
            const enCours = interventions.filter(i => i.status === 'En cours').length;
            const fini = interventions.filter(i => i.status === 'Fini').length;
            const enAttente = interventions.filter(i => i.status === 'En attente').length;

            return { total, enCours, fini, enAttente };
          })
        );
      }

      getInterventionById(id: number): Observable<Intervention | undefined> {
        // Dans un cas réel, vous feriez un appel HTTP
        // return this.http.get<Intervention>(`api/interventions/${id}`);
        const intervention = this.interventions.find((i) => i.id === id)
        return of(intervention)
      }

      addIntervention(intervention: Omit<Intervention, 'id'>): Observable<Intervention> {
        const newId = Math.max(...this.interventions.map(i => i.id), 0) + 1;
        const newIntervention = { ...intervention, id: newId };

        this.interventions.push(newIntervention);
        this.interventionsSubject.next([...this.interventions]);

        return of(newIntervention);
      }

      updateIntervention(id: number, intervention: Omit<Intervention, "id">): Observable<Intervention> {
        // Dans un cas réel, vous feriez un appel HTTP PUT
        // return this.http.put<Intervention>(`api/interventions/${id}`, intervention);

        const index = this.interventions.findIndex((i) => i.id === id)
        if (index !== -1) {
          const updatedIntervention = { ...intervention, id }
          this.interventions[index] = updatedIntervention
          this.interventionsSubject.next([...this.interventions])
          return of(updatedIntervention)
        }

        throw new Error(`Intervention with id ${id} not found`)
      }

      deleteIntervention(id: number): Observable<void> {
        // Dans un cas réel, vous feriez un appel HTTP DELETE
        // return this.http.delete<void>(`api/interventions/${id}`);

        const index = this.interventions.findIndex((i) => i.id === id)
        if (index !== -1) {
          this.interventions.splice(index, 1)
          this.interventionsSubject.next([...this.interventions])
          return of(void 0)
        }

        throw new Error(`Intervention with id ${id} not found`)
      }
}
