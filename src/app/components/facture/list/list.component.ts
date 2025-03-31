import { Component } from '@angular/core';
import { Invoice, InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule,RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class InvoiceListComponent {
  invoices: Invoice[] = []

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoices = data
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Payée":
        return "status-paid"
      case "En retard":
        return "status-overdue"
      case "En attente":
      default:
        return "status-pending"
    }
  }

  printInvoice(invoice: Invoice): void {
    window.print()
  }

  downloadInvoice(invoice: Invoice): void {
    // Logique pour télécharger la facture
    console.log("Téléchargement de la facture:", invoice.invoiceNumber)
  }

  getDetail(invoiceNumber: string){
    this.router.navigate(['/factures', invoiceNumber]);
  }
}

