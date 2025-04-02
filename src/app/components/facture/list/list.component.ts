import { Component, ElementRef, ViewChild } from '@angular/core';
import { Invoice, InvoiceService, StatutInvoice } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class InvoiceListComponent {
  invoices: Invoice[] = []
  statutOptions = Object.values(StatutInvoice)
  @ViewChild('filter') filter!: ElementRef;
  loading: boolean = true;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoices = data
      this.loading = false;
    })
  }


  printInvoice(invoice: Invoice): void {
    window.print()
  }

  downloadInvoice(invoice: Invoice): void {
    // Logique pour télécharger la facture
    console.log("Téléchargement de la facture:", invoice.invoiceNumber)
  }

  getDetail(invoiceNumber: string){
    this.router.navigate(['/dash/factures', invoiceNumber]);
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(etat: string) {
    switch (etat) {
        case 'Payée':
            return 'success';

        case 'Confirmée':
            return 'warn';

        case 'Annulée':
            return 'danger';

        default:
            return 'info';
    }
  }
}

