import { Injectable } from '@angular/core';

export interface Employe {
  id: number;
  nom: string;
  email: string;
  contact: string;
  adresse: string;
  poste: string;
  salaire: number;
  etat:number;
}


@Injectable({
  providedIn: 'root'
})


export class EmployeService {

  constructor() { }
}
