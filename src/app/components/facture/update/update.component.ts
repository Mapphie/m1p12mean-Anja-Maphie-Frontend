import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { Invoice, InvoiceItem, InvoiceService } from "../../../services/invoice.service"


@Component({
  selector: "app-invoice-edit",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.scss"],
})
export class InvoiceEditComponent implements OnInit {
  invoice: Invoice = {
    id: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    quoteNumber: "", // Optionnel
    items: [],
    subtotal: 0,
    taxRate: 20, // Supposition d'un taux de TVA par défaut
    taxAmount: 0,
    total: 0,
    status: "En attente",
    notes: ""
};


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

  vehicleInfo = {
    registration: "AB-123-CD",
    brand: "Renault",
    model: "Clio",
    serialNumber: "SER12345678",
    mileage: "45000",
  }

  selectedClient = ""
  loading = true
  notFound = false

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.invoiceService.getInvoiceByNumber(id).subscribe((invoice) => {
          if (invoice) {
            this.invoice = { ...invoice }

            // Trouver le client correspondant pour le sélecteur
            const client = this.clients.find((c) => c.name === this.invoice.clientName)
            if (client) {
              this.selectedClient = client.id
            }

            this.loading = false
          } else {
            this.notFound = true
            this.loading = false
          }
        })
      }
    })
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
    this.invoice.items.push({
      designation: "",
      price: 0,
      quantity: 1,
      amount: 0,
    })
  }

  removeItem(index: number): void {
    if (this.invoice.items.length > 1) {
      this.invoice.items.splice(index, 1)
      this.calculateTotals()
    }
  }

  updateItemTotal(item: InvoiceItem): void {
    item.amount = item.quantity * item.price
    this.calculateTotals()
  }

  calculateTotals(): void {
    this.invoice.total = this.invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.amount, 0)
    this.invoice.taxAmount = this.invoice.total * 0.2 // 20% TVA
    this.invoice.total = this.invoice.total + this.invoice.taxAmount
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.invoiceService.updateInvoice(this.invoice).subscribe(() => {
        this.router.navigate(["/dash/factures", this.invoice.id])
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
      this.invoice.items.every((item: InvoiceItem) => item.designation && item.quantity > 0)
    );
}

  cancel(): void {
    this.router.navigate(["/dash/factures", this.invoice.invoiceNumber])
  }
}

