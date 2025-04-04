import { Injectable } from '@angular/core';
import { ClientsService } from './clients.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from './service.service';
import { User } from './user.service';

export interface RendezVous {
  _id?: string;
  number: string;
  service: Service[];
  client: User;
  startTime: string;
  endTime:string;
  description:string;
  date:Date;
  etat:string;
}

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
    private apiUrl = environment.url + "rendezVous";

  constructor(
    private clientsService: ClientsService,
    private http: HttpClient
  ) { }


    getClientDetails(clientNumber: string) {
        const client = null;
        this.clientsService.getClientById(clientNumber).subscribe((client) =>{
            client = client
        })
        return client
    }

    getRdvByClient(clientNumber: string){
        return this.getRdv().pipe(
            map((rdvs: RendezVous[]) => rdvs.filter(rdv => rdv.client._id === clientNumber))
          );
    }

    getRdv(): Observable<any> {
      return this.http.get(this.apiUrl);
    }

    getRdvById(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`)
    }


    addRdv(rendezVous: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, rendezVous)
    }

    updateRdv(id: string, rendezVous: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, rendezVous)
    }



}