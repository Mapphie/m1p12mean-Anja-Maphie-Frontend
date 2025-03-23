import { Injectable } from '@angular/core';

export interface Client {
    _id?: string;
    nom: string;
    email: string;
    contact: string;
    code_postal:number;
    ville:string;
    adresse: string;
    type:string;
    date:Date;
    etat:string;
  }

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor() { }

  getData(){
    return [
        {
            number: "CLT0001",
            nom: "Jean Dupont",
            email: "jean.dupont@example.com",
            contact: "+33 6 12 34 56 78",
            code_postal: 75001,
            ville: "Paris",
            adresse: "12 Rue de Rivoli",
            type: "Particulier",
            date: new Date("2024-03-19T10:00:00Z"),
            etat: "actif"
          },
          {
            number: "CLT0002",
            nom: "Garage Auto Express",
            email: "contact@autoexpress.com",
            contact: "+33 1 45 67 89 10",
            code_postal: 69008,
            ville: "Lyon",
            adresse: "25 Avenue des Champs",
            type: "Société",
            date: new Date("2024-02-15T15:30:00Z"),
            etat: "actif"
          },
          {
            number: "CLT0003",
            nom: "Michel Lefebvre",
            email: "michel.lefebvre@business.com",
            contact: "+33 7 98 76 54 32",
            code_postal: 31000,
            ville: "Toulouse",
            adresse: "5 Impasse des Lilas",
            type: "Association",
            date: new Date("2023-09-12T08:45:00Z"),
            etat: "inactif"
          }
    ];
  }

  getCustomers() {
    return Promise.resolve(this.getData());
}

}
