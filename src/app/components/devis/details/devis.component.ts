import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Devis, DevisService, StatutDevis } from '../../../services/devis.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-devis',
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule,ButtonModule,ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.scss'
})
export class DevisComponent implements OnInit{
  devis: Devis | undefined
  totalHT = 0
  totalTaxes = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private devisService: DevisService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.chargerDevis()
  }

  chargerDevis(): void {
    const id = String(this.route.snapshot.paramMap.get("id"))
    this.devisService.getDevisById(id).subscribe((devis) => {
      this.devis = devis
      if (devis) {
        this.calculerTotaux()
      }
    })
  }

  calculerTotaux(): void {
    if (!this.devis || !this.devis.lignes) {
      return
    }

    let totalHT = 0
    let totalTaxes = 0

    for (const ligne of this.devis.lignes) {
      const prixHTApresRemise = ligne.prixUnitaireHT * (1 - ligne.remise / 100) * ligne.quantite
      const montantTaxe = prixHTApresRemise * (ligne.taxe / 100)

      totalHT += prixHTApresRemise
      totalTaxes += montantTaxe
    }

    this.totalHT = totalHT
    this.totalTaxes = totalTaxes
  }

  modifierDevis(): void {
    console.log('TRYING TO UPDATE');

    if (this.devis) {
        console.log('DEVIS : ',this.devis);

      this.router.navigate(["/devis/update", this.devis.numero])
    }
  }

  confirmerDevis(): void {
    if (this.devis) {
      this.devisService.changerStatutDevis(this.devis.numero, StatutDevis.CONFIRME).subscribe((devis) => {
        this.devis = devis
      })
    }
  }


  facturerDevis(): void {
    if (this.devis) {
      this.devisService.changerStatutDevis(this.devis.numero, StatutDevis.FACTURE).subscribe((devis) => {
        this.devis = devis
      })
    }
  }

  annulerDevis(): void {
    this.confirmationService.confirm({
        message: "Êtes-vous sûr de vouloir annuler ce devis ?",
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          if (this.devis) {
            this.devisService.changerStatutDevis(this.devis.numero, StatutDevis.ANNULE).subscribe((devis) => {
              this.devis = devis
            })
          }

          this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Devis annulé',
              life: 3000
          });
        }
    });
}

}

