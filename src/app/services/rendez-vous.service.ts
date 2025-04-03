import { Injectable } from '@angular/core';
import { ClientsService } from './clients.service';

export interface RendezVous {
  _id?: string;
  number: string;
  service: string[];
  client: string;
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

  constructor(
    private clientsService: ClientsService
  ) { }

  getData(){
    return [
      {
        number: "RDV001",
        service: ["Changement d'huile","Remplacement des freins"],
        client: "CLT0001",
        startTime: "08:30",
        endTime: "09:30",
        description: "Vidange complète avec changement de filtre",
        date: new Date("2025-03-25"),
        etat: "Confirmé"
      },
      {
        number: "RDV002",
        service: ["Révision"],
        client: "CLT0002",
        startTime: "10:00",
        endTime: "15:30",
        description: "Contrôle général du véhicule avec diagnostic",
        date: new Date("2025-03-26"),
        etat: "En attente"
      },
      {
        number: "RDV003",
        service: ["Remplacement des freins"],
        client: "CLT0003",
        startTime: "14:00",
        endTime: "15:30",
        description: "Changement des plaquettes et disques avant",
        date: new Date("2025-03-27"),
        etat: "Annulé"
      }
    ];
  }

  getAllData() {
    return Promise.resolve(this.getData());
  }

  getClientDetails(clientNumber: string) {
    const client = null;
    this.clientsService.getClientById(clientNumber).subscribe((client) =>{
        client = client
    })
    return client
  }

  getRdvByClient(clientNumber: string){
    const rdvs = this.getData();
    return rdvs.filter(rdv => rdv.client === clientNumber ) || null;
  }
}