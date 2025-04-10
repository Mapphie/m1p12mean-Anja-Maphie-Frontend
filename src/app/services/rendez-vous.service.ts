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
        const rdvToSend = this.prepareRdvForApi(rendezVous)
        return this.http.post<RendezVous>(this.apiUrl, rdvToSend)
    }

    updateRdv(id: string, rendezVous: any): Observable<any> {
        const rdvToSend = this.prepareRdvForApi(rendezVous)
        return this.http.put<any>(`${this.apiUrl}/${id}`, rdvToSend)
    }

    deleteRdv(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`);
    }


    private prepareRdvForApi(rdv: any): any {
        const prepared = { ...rdv }

        // If service is an array of objects, extract just the IDs
        if (prepared.service && Array.isArray(prepared.service)) {
          if (prepared.service.length > 0 && typeof prepared.service[0] === "object" && prepared.service[0] !== null) {
            prepared.service = prepared.service.map((service : Service) => service._id || service)
          }
        }

        // If client is an object, extract just the ID
        if (prepared.client && typeof prepared.client === "object" && prepared.client !== null) {
          prepared.client = prepared.client._id || prepared.client
        }

        return prepared
    }



}