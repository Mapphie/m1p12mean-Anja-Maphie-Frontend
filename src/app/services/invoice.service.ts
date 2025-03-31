import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface InvoiceItem {
  designation: string
  quantity: number
  price: number
  amount: number
}

export interface Invoice {
  id: string
  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  quoteNumber?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  status: "En attente" | "Payée" | "En retard"
  notes?: string
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "F-2025-0001",
      clientName: "Client SARL",
      clientAddress: "456 Avenue du Commerce\n69002 Lyon, France",
      clientEmail: "contact@client.fr",
      clientPhone: "+33 9 87 65 43 21",
      issueDate: "2025-03-31",
      dueDate: "2025-04-30",
      quoteNumber: "D-2025-0001",
      items: [
        { designation: "Consultation initiale", quantity: 1, price: 150, amount: 150 },
        { designation: "Développement de site web", quantity: 1, price: 1200, amount: 1200 },
        { designation: "Hébergement (annuel)", quantity: 1, price: 120, amount: 120 },
      ],
      subtotal: 1470,
      taxRate: 0.2,
      taxAmount: 294,
      total: 1764,
      status: "En attente",
    },
    {
      id: "2",
      invoiceNumber: "F-2025-0002",
      clientName: "Entreprise ABC",
      clientAddress: "789 Boulevard des Affaires\n75008 Paris, France",
      clientEmail: "contact@abc.fr",
      clientPhone: "+33 1 23 45 67 89",
      issueDate: "2025-03-28",
      dueDate: "2025-04-27",
      items: [
        { designation: "Refonte graphique", quantity: 1, price: 2500, amount: 2500 },
        { designation: "Formation équipe", quantity: 2, price: 450, amount: 900 },
      ],
      subtotal: 3400,
      taxRate: 0.2,
      taxAmount: 680,
      total: 4080,
      status: "Payée",
    },
    {
      id: "3",
      invoiceNumber: "F-2025-0003",
      clientName: "Société XYZ",
      clientAddress: "123 Rue du Commerce\n33000 Bordeaux, France",
      clientEmail: "contact@xyz.fr",
      clientPhone: "+33 5 55 55 55 55",
      issueDate: "2025-03-25",
      dueDate: "2025-04-24",
      items: [
        { designation: "Maintenance mensuelle", quantity: 3, price: 250, amount: 750 },
        { designation: "Mise à jour sécurité", quantity: 1, price: 350, amount: 350 },
      ],
      subtotal: 1100,
      taxRate: 0.2,
      taxAmount: 220,
      total: 1320,
      status: "En retard",
    },
  ]

  constructor() {}

  getInvoices(): Observable<Invoice[]> {
    return of(this.invoices)
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    const invoice = this.invoices.find((inv) => inv.id === id)
    return of(invoice)
  }

  getInvoiceByNumber(number: string): Observable<Invoice | undefined> {
    const invoice = this.invoices.find((inv) => inv.invoiceNumber === number)
    return of(invoice)
  }

  addInvoice(invoice: Omit<Invoice, "id">): Observable<Invoice> {
    const newId = (this.invoices.length + 1).toString()
    const newInvoice = { ...invoice, id: newId }
    this.invoices.push(newInvoice)
    return of(newInvoice)
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    const index = this.invoices.findIndex((inv) => inv.id === invoice.id)
    if (index !== -1) {
      this.invoices[index] = invoice
    }
    return of(invoice)
  }

  deleteInvoice(id: string): Observable<boolean> {
    const initialLength = this.invoices.length
    this.invoices = this.invoices.filter((inv) => inv.id !== id)
    return of(this.invoices.length !== initialLength)
  }

  generateInvoiceNumber(): string {
    const year = new Date().getFullYear()
    const count = this.invoices.length + 1
    return `F-${year}-${count.toString().padStart(4, "0")}`
  }
}

