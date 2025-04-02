import { Injectable } from '@angular/core';

export class Vehicule {
    _id?: string;
    marque: string;
    modele: string;
    immatriculation: string;
    annee: number;
    clientId: string;  // Référence au client propriétaire du véhicule

    constructor(marque: string, modele: string, immatriculation: string, annee: number, clientId: string, _id?: string) {
      this._id = _id;
      this.marque = marque;
      this.modele = modele;
      this.immatriculation = immatriculation;
      this.annee = annee;
      this.clientId = clientId;
    }
  }

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  constructor() { }
}
