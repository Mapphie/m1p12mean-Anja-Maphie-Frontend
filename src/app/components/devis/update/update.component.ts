import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevisService, LigneDevis } from '../../../services/devis.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { debounceTime } from "rxjs/operators"
import { merge } from "rxjs"
import { DialogService } from "primeng/dynamicdialog"

@Component({
  selector: 'app-update',
  imports: [CommonModule,ConfirmDialogModule,FormsModule,ProgressSpinnerModule,InputNumberModule,ButtonModule,TableModule,ReactiveFormsModule,InputTextModule,CalendarModule,SelectButtonModule],
  providers: [MessageService, ConfirmationService,DialogService],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateQuoteComponent {
  quoteForm!: FormGroup
  quoteId!: string
  loading = true
  statuses = ["Brouillon", "Confirmé", "Facturé", "Annulé"]
  totalHT = 0
  totalTaxes = 0
  totalTTC = 0
  autoCalculate = true // Nouvelle propriété pour contrôler les calculs automatiques

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: DevisService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.initForm()

    this.route.params.subscribe((params) => {
      this.quoteId = params["id"]
      if (this.quoteId) {
        this.loadQuote(this.quoteId)
      } else {
        this.loading = false
      }
    })
  }

  initForm(): void {
    this.quoteForm = this.fb.group({
      numero: ["", Validators.required],
      etat: ["Brouillon", Validators.required],
      dateCreation: [new Date(), Validators.required],
      client: this.fb.group({
        id: [""],
        nom: ["", Validators.required],
      }),
      adresseFacturation: [""],
      conditionPaiement: [""],
      vehiculeInfo: this.fb.group({
        immatriculation: [""],
        marque: [""],
        modele: [""],
        kilometrage: [0],
      }),
      lignes: this.fb.array([]),
    })
  }

  // Modifier la méthode loadQuote pour optimiser le chargement
  loadQuote(id: string): void {
    this.loading = true
    this.quoteService.getDevisById(id).subscribe(
      (quote) => {
        // Désactiver la détection de changements pendant les mises à jour massives
        this.changeDetectorRef.detach()

        // Clear existing line items
        while (this.lignes.length) {
          this.lignes.removeAt(0)
        }

        // Set the form values first (sans les lignes)
        this.quoteForm.patchValue({
          numero: quote!.numero,
          etat: quote!.etat,
          dateCreation: new Date(quote!.dateCreation),
          client: quote!.client,
          adresseFacturation: quote!.adresseFacturation,
          conditionPaiement: quote!.conditionPaiement,
          vehiculeInfo: quote!.vehiculeInfo,
        })

        // Ajouter les lignes en batch pour éviter les recalculs multiples
        if (quote!.lignes && quote!.lignes.length) {
          // Désactiver temporairement les calculs automatiques
          this.autoCalculate = false

          // Ajouter toutes les lignes
          quote!.lignes.forEach((ligne: LigneDevis) => {
            this.addLigne(ligne)
          })

          // Réactiver les calculs et faire un seul calcul
          this.autoCalculate = true
          this.calculateTotals()
        }

        // Réactiver la détection de changements et forcer une mise à jour
        this.changeDetectorRef.reattach()
        this.changeDetectorRef.markForCheck()

        this.loading = false
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger le devis",
        })
        this.loading = false
      },
    )
  }

  get lignes(): FormArray {
    return this.quoteForm.get("lignes") as FormArray
  }

  addLigne(ligne: LigneDevis | null= null): void {
    const ligneForm = this.fb.group({
      reference: [ligne ? ligne.reference : ""],
      article: [ligne ? ligne.article : "", Validators.required],
      description: [ligne ? ligne.description : ""],
      remise: [ligne ? ligne.remise : 0],
      prixUnitaireHT: [ligne ? ligne.prixUnitaireHT : 0, Validators.required],
      taxe: [ligne ? ligne.taxe : 20], // Default VAT rate
      quantite: [ligne ? ligne.quantite : 1, [Validators.required, Validators.min(1)]],
      totalTTC: [{ value: ligne ? ligne.totalTTC : 0, disabled: true }],
    })

    // Utiliser merge pour combiner tous les observables et ajouter un debounceTime
    merge(
      ligneForm.get("prixUnitaireHT")!.valueChanges,
      ligneForm.get("remise")!.valueChanges,
      ligneForm.get("taxe")!.valueChanges,
      ligneForm.get("quantite")!.valueChanges,
    )
      .pipe(debounceTime(100))
      .subscribe(() => {
        if (this.autoCalculate) {
          this.calculateLineTotals(ligneForm)
        }
      })

    this.lignes.push(ligneForm)
    this.calculateTotals()
  }

  removeLigne(index: number): void {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer cette ligne ?",
      accept: () => {
        this.lignes.removeAt(index)
        this.calculateTotals()
      },
    })
  }

  // Modifier calculateLineTotals pour respecter le flag autoCalculate
  calculateLineTotals(ligneForm: FormGroup): void {
    const prixHT = ligneForm.get("prixUnitaireHT")?.value || 0
    const remise = ligneForm.get("remise")?.value || 0
    const taxe = ligneForm.get("taxe")?.value || 0
    const quantite = ligneForm.get("quantite")?.value || 1

    const prixRemise = prixHT * (1 - remise / 100)
    const totalHT = prixRemise * quantite
    const totalTTC = totalHT * (1 + taxe / 100)

    ligneForm.get("totalTTC")?.setValue(totalTTC, { emitEvent: false })

    // Ne recalculer les totaux que si autoCalculate est true
    if (this.autoCalculate) {
      this.calculateTotals()
    }
  }

  calculateTotals(): void {
    let totalHT = 0
    let totalTaxes = 0
    let totalTTC = 0

    this.lignes.controls.forEach((ligne) => {
      const prixHT = ligne.get("prixUnitaireHT")?.value || 0
      const remise = ligne.get("remise")?.value || 0
      const taxe = ligne.get("taxe")?.value || 0
      const quantite = ligne.get("quantite")?.value || 1

      const prixRemise = prixHT * (1 - remise / 100)
      const ligneHT = prixRemise * quantite
      const ligneTaxes = ligneHT * (taxe / 100)
      const ligneTTC = ligneHT + ligneTaxes

      totalHT += ligneHT
      totalTaxes += ligneTaxes
      totalTTC += ligneTTC
    })

    // You can store these values in component properties if needed
    this.totalHT = totalHT
    this.totalTaxes = totalTaxes
    this.totalTTC = totalTTC
  }

  onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez corriger les erreurs dans le formulaire",
      })
      return
    }

    const quoteData = this.prepareQuoteData()

    this.loading = true
    if (this.quoteId) {
      this.quoteService.updateQuote(this.quoteId, quoteData).subscribe(
        (response) => {
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Devis mis à jour avec succès",
          })
          this.router.navigate(["/devis", this.quoteId])
          this.loading = false
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Erreur lors de la mise à jour du devis",
          })
          this.loading = false
        },
      )
    } else {
      this.quoteService.createQuote(quoteData).subscribe(
        (response) => {
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Devis créé avec succès",
          })
          this.router.navigate(["/devis", response.id])
          this.loading = false
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Erreur lors de la création du devis",
          })
          this.loading = false
        },
      )
    }
  }

  prepareQuoteData(): any {
    const formValue = this.quoteForm.getRawValue()

    // Calculate totals
    this.calculateTotals()

    // Add calculated totals
    formValue.totalHT = this.totalHT
    formValue.totalTaxes = this.totalTaxes
    formValue.total = this.totalTTC

    return formValue
  }

  cancel(): void {
    if (this.quoteId) {
      this.router.navigate(["/devis", this.quoteId])
    } else {
      this.router.navigate(["/devis"])
    }
  }

//   searchClient(): void {
//     // Create a reference to the dialog
//     this.dialogService
//       .open(ClientSearchComponent, {
//         header: "Rechercher un client",
//         width: "70%",
//         contentStyle: { overflow: "auto" },
//         baseZIndex: 10000,
//       })
//       .onClose.subscribe((client) => {
//         if (client) {
//           // Update the client information in the form
//           this.quoteForm.patchValue({
//             client: {
//               id: client.id,
//               nom: client.nom,
//             },
//             adresseFacturation: client.adresse,
//           })
//         }
//       })
//   }
}

