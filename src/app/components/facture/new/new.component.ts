import { Component } from '@angular/core';
import { Invoice, InvoiceItem, InvoiceService } from '../../../services/invoice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
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
import { Client, ClientsService } from '../../../services/clients.service';
import { Service, ServiceService } from '../../../services/service.service';
import { ClientVehicule, ClientVehiculeService } from '../../../services/client-vehicule.service';

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
  invoice: Invoice = {} as Invoice

  clients: Client[] = [];
  services: Service[] = [];
  vehicules: ClientVehicule[] = [];
  defaultService: Service = {} as Service;

  selectedClient = "";
  selectedVehicule = "";

  constructor(
    private invoiceService: InvoiceService,
    private clientService: ClientsService,
    private serviceService: ServiceService,
    private vehiculeService: ClientVehiculeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.invoice.number = "FAC0002"
    this.loadClients();
    this.loadServices();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe((services) => {
      this.services = services;
    });
    this.defaultService = this.services[0]
  }

  loadVehicules(): void {
    this.vehiculeService.getAllVehicules().subscribe((vehicules) => {
      this.vehicules = vehicules;
    });
  }

  onClientChange(): void {
    const client = this.clients.find((c) => c._id === this.selectedClient);

    if (client) {
      this.invoice.client = client;
      this.vehiculeService.getVehiculesByClientId(this.selectedClient).subscribe((vehicules) => {
        this.vehicules = vehicules;
      });
    }
  }

  onVehiculeChange(): void{
    const vehicule = this.vehicules.find((c) => c._id === this.selectedVehicule);

    if (vehicule) {
      this.invoice.vehicule = vehicule;
      this.vehiculeService.getVehiculesByClientId(this.selectedVehicule).subscribe((vehicules) => {
        this.vehicules = vehicules;
      });
    }
  }

  addItem(): void {
    if (!this.invoice) return;

    const item: InvoiceItem = {
      service: this.defaultService, // pas encore de service choisi
      description: '',
      remise: 0,
      prixUnitaireHT: 0,
      taxe: 20,
      quantite: 1,
      totalHT: 0,
      totalTTC: 0
    };

    this.invoice.lignes.push(item);
  
  }

  removeItem(index: number): void {
    if (this.invoice.lignes.length > 1) {
      this.invoice.lignes.splice(index, 1);
      this.calculateTotals();
    }
  }

  updateItemAmount(item: InvoiceItem): void {
    item.totalHT = item.prixUnitaireHT * item.quantite;
    item.totalTTC = item.totalHT + (item.totalHT * (item.taxe / 100));
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.invoice.totalHT = this.invoice.lignes.reduce((sum, item) => sum + item.totalHT, 0);
    this.invoice.totalTTC = this.invoice.lignes.reduce((sum, item) => sum + item.totalTTC, 0);
  }

  onSubmit(): void {
    if (!this.invoice) {
      alert('Formulaire incomplet');
      return;
    }
  
    if (this.isFormValid()) {
      this.invoiceService.addInvoice(this.invoice).subscribe(() => {
        this.router.navigate(['/dash/factures']);
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.invoice.number &&
      this.invoice.client &&
      this.invoice.manager &&
      this.invoice.vehicule &&
      this.invoice.lignes.length > 0 &&
      this.invoice.lignes.every((item) => item.service && item.quantite > 0)
    );
  }

  cancel(): void {
    this.router.navigate(["/dash/factures"]);
  }
  
}

