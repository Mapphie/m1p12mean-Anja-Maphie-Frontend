import { Component } from '@angular/core';
import { DevisService, StatutDevis } from '../../../services/devis.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Service, ServiceService } from '../../../services/service.service';
import { Client,ClientsService } from '../../../services/clients.service';


@Component({
  selector: 'app-new',
  imports: [CommonModule, CurrencyPipe, FormsModule,ButtonModule,ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent {
  devisForm: FormGroup
  clients: Client[] = []
  services: Service[] = []
  totalHT = 0
  totalTaxes = 0
  totalTTC = 0

  constructor(
    private fb: FormBuilder,
    private devisService: DevisService,
    private clientService: ClientsService,
    private serviceService: ServiceService,
    private router: Router,
  ) {
    this.devisForm = this.fb.group({
      clientId: ["", Validators.required],
      vehicule: [""],
      dateCommande: [new Date().toISOString().split("T")[0], Validators.required],
      conditionPaiement: ["", Validators.required],
      lignes: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.chargerClients()
    this.chargerServices()
    this.ajouterLigne()
  }

  get lignesArray(): FormArray {
    return this.devisForm.get("lignes") as FormArray
  }

  chargerClients(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients
    })
  }

  chargerServices(): void {
    this.serviceService.getAllServices().subscribe((services) => {
      this.services = services
    })
  }

  creerLigneForm(): FormGroup {
    return this.fb.group({
      reference: [""],
      serviceId: [""],
      description: [""],
      remise: [0],
      prixUnitaireHT: [0],
      taxe: [20], // Taux par défaut
      quantite: [1],
      totalTTC: [0],
    })
  }

  ajouterLigne(): void {
    this.lignesArray.push(this.creerLigneForm())
  }

  supprimerLigne(index: number): void {
    this.lignesArray.removeAt(index)
    this.calculerTotaux()
  }

  onServiceChange(index: number): void {
    const ligneForm = this.lignesArray.at(index) as FormGroup
    const serviceId = ligneForm.get("serviceId")?.value

    if (serviceId) {
      this.serviceService.getServiceById(serviceId).subscribe(service => {
        if (service) {
            ligneForm.patchValue({
              description: service.description,
              prixUnitaireHT: service.prix,
              taxe: 20,
            })
            this.calculerTotal(index)
          }
        }, error => {
            console.error('Erreur lors de la récupération du service:', error);
        })
    }
  }

  calculerTotal(index: number): void {
    const ligneForm = this.lignesArray.at(index) as FormGroup
    const prixUnitaireHT = ligneForm.get("prixUnitaireHT")?.value || 0
    const quantite = ligneForm.get("quantite")?.value || 0
    const taxe = ligneForm.get("taxe")?.value || 0
    const remise = ligneForm.get("remise")?.value || 0

    const prixHTApresRemise = prixUnitaireHT * (1 - remise / 100)
    const montantTaxe = prixHTApresRemise * (taxe / 100)
    const totalTTC = (prixHTApresRemise + montantTaxe) * quantite

    ligneForm.patchValue({ totalTTC: totalTTC }, { emitEvent: false })

    this.calculerTotaux()
  }

  calculerTotaux(): void {
    let totalHT = 0
    let totalTaxes = 0
    let totalTTC = 0

    for (let i = 0; i < this.lignesArray.length; i++) {
      const ligne = this.lignesArray.at(i) as FormGroup
      const prixUnitaireHT = ligne.get("prixUnitaireHT")?.value || 0
      const quantite = ligne.get("quantite")?.value || 0
      const taxe = ligne.get("taxe")?.value || 0
      const remise = ligne.get("remise")?.value || 0

      const prixHTApresRemise = prixUnitaireHT * (1 - remise / 100) * quantite
      const montantTaxe = prixHTApresRemise * (taxe / 100)

      totalHT += prixHTApresRemise
      totalTaxes += montantTaxe
      totalTTC += prixHTApresRemise + montantTaxe
    }

    this.totalHT = totalHT
    this.totalTaxes = totalTaxes
    this.totalTTC = totalTTC
  }

  onSubmit(): void {
    if (this.devisForm.valid) {
      const formValue = this.devisForm.value
      const client = this.clientService.getClientById(formValue.clientId)

      if (!client) {
        return
      }

      const lignes = formValue.lignes.map((ligne: any) => ({
        reference: ligne.reference,
        service: ligne.serviceId,
        description: ligne.description,
        remise: ligne.remise,
        prixUnitaireHT: ligne.prixUnitaireHT,
        taxe: ligne.taxe,
        quantite: ligne.quantite,
        totalTTC: ligne.totalTTC,
      }))

      const nouveauDevis = {
        client: client,
        dateCreation: new Date(),
        manager: null,
        facture: null,
        total: this.totalTTC,
        etat: StatutDevis.BROUILLON,

        lignes: lignes,
      }

      this.devisService.ajouterDevis(nouveauDevis).subscribe((devis) => {
        this.router.navigate(["/dash/devis", devis.id])
      })
    }
  }

  annuler(): void {
    this.router.navigate(["/dash/devis"])
  }
}

