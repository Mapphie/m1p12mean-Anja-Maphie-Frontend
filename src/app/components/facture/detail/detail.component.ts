import { Component } from '@angular/core';
import { Invoice, InvoiceService } from '../../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

  generatePDF(): void {
    const pdfPreview = document.getElementById("pdf-preview")
    if (!pdfPreview) return

    html2canvas(pdfPreview).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`facture-${this.invoice?.invoiceNumber}.pdf`)
    })
  }

  downloadInvoice(): void {
    // Logique pour télécharger la facture
    console.log("Téléchargement de la facture:", this.invoice?.invoiceNumber)
  }

  sendInvoice(): void {
    // Logique pour envoyer la facture par email
    console.log("Envoi de la facture par email:", this.invoice?.invoiceNumber)
  }
}

