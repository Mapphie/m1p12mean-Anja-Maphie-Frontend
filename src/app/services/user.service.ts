import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    _id?: string;
    nom: string;
    prenom: string;
    idrole: {
        _idrole: string;
        role: string
    };
    adresse : string;
    email: string;
    contact: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.url + "users";
    private apiUrlmanager = environment.url + "manager/users";
    private apiUrlclient = environment.url + "client/users";
    constructor(private http: HttpClient) { }

    getUser() {
        return Promise.resolve(this.getAllUsers());
    }

    getAllUsers(): Observable<any> {
        return this.http.get(this.apiUrlmanager);
    }

    addUser(user: any): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    updateUser(id: string, user: any): Observable<any> {
        return this.http.put(`${this.apiUrlclient}/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrlmanager}/${id}`);
    }

    sendtolog(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { email: email, password: password });
    }


}
