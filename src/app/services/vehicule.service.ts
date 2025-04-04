import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Vehicule {
    _id?: string;
    marque: string;
    modele: string;
    annee: string;
    matricule: string;
    user: string;
}

@Injectable({
    providedIn: 'root'
})
export class VehiculeService {
    private apiUrl = environment.url + "vehicules";

    constructor(private http: HttpClient) { }

    getVehicule() {
        return Promise.resolve(this.getAllVehicule());
    }

    getAllVehicule(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    addVehicule(vehicule: any): Observable<any> {
        return this.http.post(this.apiUrl, vehicule);
    }

    updateVehicule(id: string, vehicule: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, vehicule);
    }

    deleteVehicule(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getVehiculeByUserId(user: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/byid-user/${user}`);
    }

}
