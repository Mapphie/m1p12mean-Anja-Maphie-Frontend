import { Injectable } from '@angular/core';

export class Employe{
    constructor(
        public id: number,
        public nom: string,
        public email: string,
        public contact: string,
        public adresse: string,
        public poste: string,
        public salaire: number
      ) {}
}


@Injectable({
  providedIn: 'root'
})


export class EmployeService {

  constructor() { }
}
