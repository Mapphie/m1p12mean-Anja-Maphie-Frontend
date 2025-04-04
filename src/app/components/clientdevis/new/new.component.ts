import { Component } from '@angular/core';
import { Article, Client, DevisService, StatutDevis } from '../../../services/devis.service';
import { User, UserService } from '../../../services/user.service';
import { Vehicule, VehiculeService } from '../../../services/vehicule.service';
import { Service, ServiceService } from '../../../services/service.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';


@Component({
    selector: 'app-new',
    imports: [CommonModule, CurrencyPipe, FormsModule, ButtonModule, ReactiveFormsModule],
    templateUrl: './new.component.html',
    styleUrl: './new.component.scss'
})
export class NewComponent {
    devisForm: FormGroup
    clients: Client[] = []
    articles: Article[] = []
    totalHT = 0
    totalTaxes = 0
    totalTTC = 0
    user: User = {
        _id: "",
        nom: "",
        idrole: {
            _idrole: "",
            role: ""
        },
        adresse: "",
        email: "",
        contact: "",
        password: ""
    }
    vehicules: Vehicule[] = []
    services: Service[] = []

    constructor(
        private fb: FormBuilder,
        private devisService: DevisService,
        private userService: UserService,
        private vehiculeService: VehiculeService,
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
        this.chargerArticles()
        this.ajouterLigne()
        this.loadDataClient()
        this.loadDataVehicule()
        this.loadDataService()
    }

    get lignesArray(): FormArray {
        return this.devisForm.get("lignes") as FormArray
    }

    chargerClients(): void {
        this.devisService.getClients().subscribe((clients) => {
            this.clients = clients
        })
    }

    chargerArticles(): void {
        this.devisService.getArticles().subscribe((articles) => {
            this.articles = articles
        })
    }

    loadDataClient(): void {
        this.userService.getUserById("67eaf75fcac2069cac2eb1c2").subscribe(data => this.user = data);
    }
    loadDataVehicule(): void {
        this.vehiculeService.getAllVehicule().subscribe(data => this.vehicules = data);
    }

    loadDataService(): void {
        this.serviceService.getAllServices().subscribe(data => this.services = data);
    }

    creerLigneForm(): FormGroup {
        return this.fb.group({
            reference: [""],
            articleId: [""],
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

    onArticleChange(index: number): void {
        const ligneForm = this.lignesArray.at(index) as FormGroup
        const articleId = ligneForm.get("articleId")?.value

        if (articleId) {
            const article = this.articles.find((a) => a.reference === articleId)
            if (article) {
                ligneForm.patchValue({
                    reference: article.reference,
                    description: article.designation,
                    prixUnitaireHT: article.prixUnitaire,
                    taxe: article.taxe,
                })
                this.calculerTotal(index)
            }
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
            const client = this.clients.find((c) => c.id === Number.parseInt(formValue.clientId))

            if (!client) {
                return
            }

            const lignes = formValue.lignes.map((ligne: any) => ({
                reference: ligne.reference,
                article: ligne.articleId,
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
                datePrevue: null,
                manager: null,
                facture: null,
                total: this.totalTTC,
                etat: StatutDevis.BROUILLON,
                conditionPaiement: formValue.conditionPaiement,
                adresseFacturation: "",
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

