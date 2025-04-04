import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.service';

export interface Client {
    _id?: string;
    nom: string;
    idrole: {
        _idrole: string;
        role: string
    };
    adresse: string;
    email: string;
    contact: string;
    password: string;
  }

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = environment.url + "users";


  constructor(private http: HttpClient) { }

  getClients(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
        map(users => users.filter(user => user.idrole.role === 'Client'))
    );
  }

  getClientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  addClient(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateClient(id: string, user: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }

    deleteClient(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }


}
