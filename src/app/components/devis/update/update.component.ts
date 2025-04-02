import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-update',
  imports: [CommonModule,ConfirmDialogModule,DatePickerModule,IconFieldModule,InputIconModule,FormsModule,ProgressSpinnerModule,InputNumberModule,ButtonModule,TableModule,ReactiveFormsModule,InputTextModule,CalendarModule,SelectButtonModule],
  providers: [MessageService, ConfirmationService,DialogService],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateQuoteComponent implements OnInit {
    quoteForm!: FormGroup
    quoteId!: string
    loading = true
    statuses = ["Brouillon", "Confirmé", "Facturé", "Annulé"]
    totalHT = 0
    totalTaxes = 0
    totalTTC = 0
    autoCalculate = true
    loader = [false, false, false, false]

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
          // Ensure UI updates
          this.changeDetectorRef.detectChanges()
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
          adresseFacturation: [""],
          conditionPaiement: [""],
        }),
        vehiculeInfo: this.fb.group({
          immatriculation: [""],
          marque: [""],
          modele: [""],
          kilometrage: [0],
        }),
        lignes: this.fb.array([]),
      })
    }

    loadQuote(id: string): void {
      this.loading = true
      this.quoteService.getDevisById(id).subscribe(
        (quote) => {
          if (!quote) {
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Devis non trouvé",
            })
            this.loading = false
            return
          }

          // Clear existing line items
          while (this.lignes.length) {
            this.lignes.removeAt(0)
          }

          // Set the form values
          this.quoteForm.patchValue({
            numero: quote.numero,
            etat: quote.etat,
            dateCreation: new Date(quote.dateCreation),
            client: {
              id: quote.client?.id || "",
              nom: quote.client?.nom || "",
            },
            adresseFacturation: quote.adresseFacturation,
            conditionPaiement: quote.conditionPaiement,
            vehiculeInfo: quote.vehiculeInfo || {
              immatriculation: "",
              marque: "",
              modele: "",
              kilometrage: 0,
            },
          })

          // Add lines in batch
          this.autoCalculate = false
          if (quote.lignes && quote.lignes.length) {
            quote.lignes.forEach((ligne: LigneDevis) => {
              this.addLigne(ligne)
            })
          }

          // Re-enable calculations and update totals
          this.autoCalculate = true
          this.calculateTotals()

          this.loading = false

          // Force change detection to update the view
          setTimeout(() => {
            this.changeDetectorRef.detectChanges()
          })
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

    addLigne(ligne: LigneDevis | null = null): void {
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

      // Calculate initial line total
      this.calculateLineTotals(ligneForm)

      // Setup change listeners with debounce
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
            this.calculateTotals()
            this.changeDetectorRef.detectChanges()
          }
        })

      this.lignes.push(ligneForm)

      if (this.autoCalculate) {
        this.calculateTotals()
      }
    }

    removeLigne(index: number): void {
      this.confirmationService.confirm({
        message: "Êtes-vous sûr de vouloir supprimer cette ligne ?",
        accept: () => {
          this.lignes.removeAt(index)
          this.calculateTotals()
          this.changeDetectorRef.detectChanges()
        },
      })
    }

    calculateLineTotals(ligneForm: FormGroup): void {
      const prixHT = ligneForm.get("prixUnitaireHT")?.value || 0
      const remise = ligneForm.get("remise")?.value || 0
      const taxe = ligneForm.get("taxe")?.value || 0
      const quantite = ligneForm.get("quantite")?.value || 1

      const prixRemise = prixHT * (1 - remise / 100)
      const totalHT = prixRemise * quantite
      const totalTTC = totalHT * (1 + taxe / 100)

      ligneForm.get("totalTTC")?.setValue(totalTTC, { emitEvent: false })
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
        this.quoteService
          .updateQuote(this.quoteId, quoteData)
          .subscribe(
            (response) => {
              this.messageService.add({
                severity: "success",
                summary: "Succès",
                detail: "Devis mis à jour avec succès",
              })
              this.router.navigate(["/dash/devis", this.quoteId])
            },
            (error) => {
              this.messageService.add({
                severity: "error",
                summary: "Erreur",
                detail: "Erreur lors de la mise à jour du devis",
              })
            },
          )
          .add(() => {
            this.loading = false
          })
      } else {
        this.quoteService
          .createQuote(quoteData)
          .subscribe(
            (response) => {
              this.messageService.add({
                severity: "success",
                summary: "Succès",
                detail: "Devis créé avec succès",
              })
              this.router.navigate(["/dash/devis", response.id])
            },
            (error) => {
              this.messageService.add({
                severity: "error",
                summary: "Erreur",
                detail: "Erreur lors de la création du devis",
              })
            },
          )
          .add(() => {
            this.loading = false
          })
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
        this.router.navigate(["/dash/devis", this.quoteId])
      } else {
        this.router.navigate(["/dash/devis"])
      }
    }

    load(index: number) {
      this.loader[index] = true
      setTimeout(() => {
        this.loader[index] = false
        this.changeDetectorRef.detectChanges()
      }, 1000)
    }
  }



