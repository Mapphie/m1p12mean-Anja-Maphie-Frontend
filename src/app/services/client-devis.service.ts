import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClientVehicule } from './client-vehicule.service';
import { Service } from './service.service';
import { User } from './user.service';

export interface ClientDevis {
    _id?: string;
    client: { User: User, clientId: string };
    vehicule: ClientVehicule;
    datedemande: Date;
    services: [{
        Service: Service,
        quantite: Number,
        serviceId: String,
    }],
    totalDevis: Number,
    status: string,
    validite: Date,
    libelle: string
}

@Injectable({
    providedIn: 'root'
})
export class ClientDevisService {

    private apiUrl = environment.url + "devis";
    private apiUrlClient = environment.url + "client/devis";

    constructor(private http: HttpClient) { }

    getClientDevis() {
        return Promise.resolve(this.getAllClientDevis());
    }

    getAllClientDevis(): Observable<any> {
        return this.http.get(this.apiUrlClient + "/clientdevis", { withCredentials: true });
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
