import { Component } from '@angular/core';
import { Invoice, InvoiceItem, InvoiceService } from '../../../services/invoice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-new',
  imports: [CommonModule,RouterModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    BadgeModule,
    DialogModule,
    ConfirmDialogModule
  ],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewInvoiceComponent {
  invoice: Invoice = {
    id: "",
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    items: [{ designation: "", quantity: 1, price: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 0.2,
    taxAmount: 0,
    total: 0,
    status: "En attente",
  }

  vehicleInfo = {
    registration: "AB-123-CD",
    brand: "Renault",
    model: "Clio",
    serialNumber: "SER12345678",
    mileage: "45000",
  }

  clients = [
    {
      id: "client1",
      name: "Client SARL",
      address: "456 Avenue du Commerce, 69002 Lyon",
      phone: "+33 9 87 65 43 21",
      email: "contact@client.fr",
    },
    {
      id: "client2",
      name: "Entreprise ABC",
      address: "789 Boulevard des Affaires, 75008 Paris",
      phone: "+33 1 11 22 33 44",
      email: "contact@abc.fr",
    },
  ]

  selectedClient = ""

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.invoice.invoiceNumber = this.invoiceService.generateInvoiceNumber()
    this.calculateTotals()
  }

  onClientChange(): void {
    const client = this.clients.find((c) => c.id === this.selectedClient)
    if (client) {
      this.invoice.clientName = client.name
      this.invoice.clientAddress = client.address
      this.invoice.clientPhone = client.phone
      this.invoice.clientEmail = client.email
    }
  }

  addItem(): void {
    this.invoice.items.push({ designation: "", quantity: 1, price: 0, amount: 0 })
  }

  removeItem(index: number): void {
    if (this.invoice.items.length > 1) {
      this.invoice.items.splice(index, 1)
      this.calculateTotals()
    }
  }

  updateItemAmount(item: InvoiceItem): void {
    item.amount = item.quantity * item.price
    this.calculateTotals()
  }

  calculateTotals(): void {
    this.invoice.subtotal = this.invoice.items.reduce((sum, item) => sum + item.amount, 0)
    this.invoice.taxAmount = this.invoice.subtotal * this.invoice.taxRate
    this.invoice.total = this.invoice.subtotal + this.invoice.taxAmount
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      // Créer une copie de l'objet invoice pour éviter les références
      const invoiceToSave: Invoice = { ...this.invoice }

      this.invoiceService.addInvoice(invoiceToSave).subscribe(() => {
        this.router.navigate(["/factures"])
      })
    } else {
      alert("Veuillez remplir tous les champs obligatoires.")
    }
  }

  isFormValid(): boolean {
    return !!(
      this.invoice.clientName &&
      this.invoice.invoiceNumber &&
      this.invoice.issueDate &&
      this.invoice.dueDate &&
      this.invoice.items.length > 0 &&
      this.invoice.items.every((item) => item.designation && item.quantity > 0)
    )
  }

  cancel(): void {
    this.router.navigate(["/factures"])
  }

  updateItemTotal(item: InvoiceItem): void {
    item.amount = item.quantity * item.price
    this.calculateTotals()
  }
}

