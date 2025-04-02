import { Vehicule } from './vehicule.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClientVehicule } from './client-vehicule.service';
import { Service } from './service.service';
import { Client } from './clients.service';

export interface ClientDevis {
    _id?: string;
    client: { User: Client, clientId: string };
    vehicule: ClientVehicule;
    datedemande: Date;
    services: [{
        Service: Service,
        quantite: Number,
        serviceId: String,
    }],
    totalDevis: Number,
    status: String,
    validite: Date,
    libelle : String
}

@Injectable({
    providedIn: 'root'
})
export class ClientDevisService {

    private apiUrl = environment.url + "devis";

    constructor(private http: HttpClient) { }

    getClientDevis() {
        return Promise.resolve(this.getAllClientDevis());
    }

    getAllClientDevis(): Observable<any> {
        return this.http.get(this.apiUrl+"/clientdevis");
    }

    addClientDevis(clientDevis: any): Observable<any> {
        return this.http.post(this.apiUrl, clientDevis);
    }

    updateClientDevis(id: string, clientDevis: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, clientDevis);
    }

    deleteclientDevis(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
