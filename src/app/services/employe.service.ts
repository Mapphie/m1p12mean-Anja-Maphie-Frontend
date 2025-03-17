import { Injectable } from '@angular/core';

export interface Employe {
  id: number;
  nom: string;
  email: string;
  contact: string;
  adresse: string;
  poste: string;
  salaire: number;
  etat:string;
}


@Injectable({
  providedIn: 'root'
})


export class EmployeService {

    constructor() { }

    getAllEmployes(){
        return [
            {
                id:1,
                nom: "John Doe",
                email: "john@gmail.com",
                contact: "012320145",
                adresse:"Lot TT 124 Ivato",
                etat: "Active",
                date: "2024-03-14",
                poste:"Mécanicien",
                salaire:300000,
                intervention:"5",
            },
            {
                id:2,
                nom: "Jane Smith",
                email: "jane@gmail.com",
                adresse:"Lot TT 124 Ivato",
                contact: "017820145",
                etat: "Inactive",
                date: "2024-02-10",
                poste:"Manager",
                salaire :500000,
                intervention:""
            },
            {
                id:3,
                nom: "Anne Marie",
                email: "marie@gmail.com",
                contact: "017828545",
                adresse:"Lot TT 124 Ivato",
                etat: "Active",
                date: "2024-02-10",
                poste:"Manager",
                salaire :500000,
                intervention:""
            }

        ];
    }

    getEmployes() {
        return Promise.resolve(this.getAllEmployes());
    }
}
