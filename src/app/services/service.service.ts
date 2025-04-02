import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Service {
    _id?: string;
    nom: string;
    categorie: string;
    description: string;
    duree: string;
    prix: string;
    image: Date;
}

@Injectable({
    providedIn: 'root'
})

export class ServiceService {

    private apiUrl = environment.url+"services";
    constructor(private http: HttpClient) { }

    getService() {
        return Promise.resolve(this.getAllServices());
    }

    getAllServices(): Observable<any>{
        return this.http.get(this.apiUrl);
    }

    addService(service: any): Observable<any>{
        return this.http.post(this.apiUrl, service);
    }

    updateService(id: string, service:any): Observable<any>{
        return this.http.put(`${this.apiUrl}/${id}`, service);
    }

    deleteService(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

}
