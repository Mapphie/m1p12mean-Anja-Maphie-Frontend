import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.service';

export interface ClientVehicule {
    _id?: string;
    type: string;
    marque: string;
    modele: string;
    annee: string;
    matricule: string;
    client :  User;
}

@Injectable({
    providedIn: 'root'
})
export class ClientVehiculeService {
    private apiUrl = environment.url + "client/vehicules";

    constructor(private http: HttpClient) { }

    getVehicule() {
        return Promise.resolve(this.getAllVehicules());
    }

    getAllVehicules(): Observable<any>{
        return this.http.get(this.apiUrl);
    }

    addVehicule(vehicule: any): Observable<any>{
        return this.http.post(this.apiUrl, vehicule);
    }

    updateVehicule(id: string, vehicule:any): Observable<any>{
        return this.http.put(`${this.apiUrl}/${id}`, vehicule);
    }

    deleteVehicule(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getVehiculeById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`)
    }

    getVehiculesByClientId(clientId: string) {
        return this.http.get<ClientVehicule[]>(`${this.apiUrl}/byid-user/${clientId}`).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 404) {
                return of([]); // retourne une liste vide au lieu de planter
              } else {
                console.error('Erreur lors de la récupération des véhicules :', error);
                return throwError(() => new Error('Erreur lors de la récupération des véhicules'));
              }
            })
          );
    }

}
