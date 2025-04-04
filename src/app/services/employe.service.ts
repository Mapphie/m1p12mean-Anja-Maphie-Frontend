import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employe {
  _id?: string;
  nom: string;
  email: string;
  contact: string;
  adresse: string;
  poste: string;
  date: Date;
  salaire: number;
  intervention: number;
  etat:string;
}


@Injectable({
  providedIn: 'root'
})


export class EmployeService {

    private apiUrl = environment.url + 'employes';

    constructor(private http: HttpClient) { }

    getEmployes() {
        return Promise.resolve(this.getAllEmployes());
    }

    getAllEmployes(): Observable<any>{
        return this.http.get(this.apiUrl);
    }

    addEmploye(employe: any): Observable<any>{
        return this.http.post(this.apiUrl, employe);
    }

    updateEmploye(id: string, employe:any): Observable<any>{
        return this.http.put(`${this.apiUrl}/${id}`, employe);
    }

    deleteEmploye(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
