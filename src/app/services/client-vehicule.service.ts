import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClientVehicule {
    _id?: string;
    type: string;
    marque: string;
    modele: string;
    annee: string;
    matricule: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientVehiculeService {
    private apiUrl = environment.url + "client-vehicule";

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

}
