import { Component } from '@angular/core';
import { Invoice, InvoiceService } from '../../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-detail',
  imports: [CommonModule,RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  activeTab = "invoice-lines"
  showPreview = false
  invoice: Invoice | undefined
  companyInfo = {
    name: "Votre Entreprise SARL",
    address: "123 Rue des Entrepreneurs",
    city: "75001 Paris, France",
    email: "contact@votreentreprise.fr",
    phone: "+33 1 23 45 67 89",
    siret: "123 456 789 00012",
    tva: "FR12 123456789",
    iban: "FR76 1234 5678 9123 4567 8912 345",
    bic: "ABCDEFGHIJK",
  }
  Math = Math;

  vehicleInfo = {
    registration: "AB-123-CD",
    brand: "Renault",
    model: "Clio",
    serialNumber: "SER12345678",
    mileage: "45000",
  }

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.invoiceService.getInvoiceByNumber(id).subscribe((invoice) => {
          this.invoice = invoice
        })
      }
    })
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview
  }

  printInvoice(): void {
    window.print()
  }



  downloadInvoice(): void {
    // Logique pour télécharger la facture
    console.log("Téléchargement de la facture:", this.invoice?.invoiceNumber)
  }

  sendInvoice(): void {
    // Logique pour envoyer la facture par email
    console.log("Envoi de la facture par email:", this.invoice?.invoiceNumber)
  }

  registerPayment(): void {
    alert("Fonctionnalité d'enregistrement de paiement à implémenter")
  }

  createCreditNote(): void {
    alert("Fonctionnalité de création d'avoir à implémenter")
  }

  setDraft(): void {
    this.router.navigate(["/dash/factures/update", this.invoice?.invoiceNumber])
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }
  getStatusLabel(): string {
    if (!this.invoice || !this.invoice.status) return "En attente"
    return this.invoice.status
  }

  getStatusClass(): string {
    if (!this.invoice || !this.invoice.status) return "status-pending"

    switch (this.invoice.status) {
      case "Payée":
        return "status-paid"
      case "En retard":
        return "status-overdue"
      case "En attente":
      default:
        return "status-pending"
    }
  }
}

