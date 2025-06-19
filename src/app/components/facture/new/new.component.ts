import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Invoice, InvoiceItem, InvoiceService } from '../../../services/invoice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
import { User } from '../../../services/user.service';

@Component({
  selector: 'app-new',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
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
  invoiceForm: FormGroup;
  invoice: Invoice = {} as Invoice;

  clients: Client[] = [];
  services: Service[] = [];
  vehicules: ClientVehicule[] = [];
  defaultService: Service = {} as Service;

  selectedClient: Client | null = null;
  selectedVehicule: ClientVehicule | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private clientService: ClientsService,
    private serviceService: ServiceService,
    private vehiculeService: ClientVehiculeService,
    private router: Router,
  ) {
    this.invoiceForm = this.fb.group({
      number: ['FAC0002', Validators.required],
      dateCreation: [new Date().toISOString().split('T')[0], Validators.required],
      selectedClient: ['', Validators.required],
      selectedVehicule: ['', Validators.required],
      clientNom: [{ value: '', disabled: true }],
      clientAdresse: [{ value: '', disabled: true }],
      clientContact: [{ value: '', disabled: true }],
      clientEmail: [{ value: '', disabled: true }],
      lignes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadServices();
    this.addItem();
  }

  get lignesFormArray(): FormArray {
    return this.invoiceForm.get('lignes') as FormArray;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      serviceNom: ['', Validators.required],
      prixUnitaireHT: [0, [Validators.required, Validators.min(0)]],
      quantite: [1, [Validators.required, Validators.min(0.5)]],
      totalTTC: [{ value: 0, disabled: true }]
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
    });
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe((services) => {
      this.services = services;
      if (services && services.length > 0) {
        this.defaultService = services[0];
      }
    });
  }

  loadVehicules(): void {
    this.vehiculeService.getAllVehicules().subscribe((vehicules) => {
      this.vehicules = vehicules;
    });
  }

  onClientChange(): void {
    const clientId = this.invoiceForm.get('selectedClient')?.value;
    const client = this.clients.find((c) => c._id === clientId);

    if (client) {
      this.selectedClient = client;
      
      // Mettre à jour les champs client dans le formulaire
      this.invoiceForm.patchValue({
        clientNom: client.nom || '',
        clientAdresse: client.adresse || '',
        clientContact: client.contact || '',
        clientEmail: client.email || ''
      });

      // Charger les véhicules du client
      this.vehiculeService.getVehiculesByClientId(clientId).subscribe((vehicules) => {
        this.vehicules = vehicules;
      });
    } else {
      this.selectedClient = null;
      this.invoiceForm.patchValue({
        clientNom: '',
        clientAdresse: '',
        clientContact: '',
        clientEmail: ''
      });
      this.vehicules = [];
    }
  }

  onVehiculeChange(): void {
    const vehiculeId = this.invoiceForm.get('selectedVehicule')?.value;
    const vehicule = this.vehicules.find((v) => v._id === vehiculeId);

    if (vehicule) {
      this.selectedVehicule = vehicule;
    } else {
      this.selectedVehicule = null;
    }
  }

  addItem(): void {
    this.lignesFormArray.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    if (this.lignesFormArray.length > 1) {
      this.lignesFormArray.removeAt(index);
      this.calculateTotals();
    }
  }

  updateItemAmount(index: number): void {
    const itemGroup = this.lignesFormArray.at(index);
    const prix = itemGroup.get('prixUnitaireHT')?.value || 0;
    const quantite = itemGroup.get('quantite')?.value || 0;
    const totalHT = prix * quantite;
    const totalTTC = totalHT * 1.2; // 20% TVA
    
    itemGroup.get('totalTTC')?.setValue(totalTTC.toFixed(2));
    this.calculateTotals();
  }

  calculateTotals(): void {
    let totalTTC = 0;
    let totalHT = 0;
    
    this.lignesFormArray.controls.forEach((control: any) => {
      const itemTTC = parseFloat(control.get('totalTTC')?.value) || 0;
      totalTTC += itemTTC;
      totalHT += itemTTC / 1.2;
    });
    
    this.invoice.totalTTC = totalTTC;
    this.invoice.totalHT = totalHT;
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      // Construire l'objet invoice à partir du formulaire
      const formValue = this.invoiceForm.value;
      
      this.invoice = {
        number: formValue.number,
        dateCreation: new Date(formValue.dateCreation),
        client: this.selectedClient!,
        vehicule: this.selectedVehicule!,
        manager: {} as User, // À définir selon vos besoins
        lignes: formValue.lignes.map((ligne: any) => ({
          service: { nom: ligne.serviceNom },
          prixUnitaireHT: ligne.prixUnitaireHT,
          quantite: ligne.quantite,
          totalHT: ligne.prixUnitaireHT * ligne.quantite,
          totalTTC: parseFloat(ligne.totalTTC),
          taxe: 20,
          remise: 0,
          description: ligne.serviceNom
        })),
        totalHT: this.invoice.totalHT,
        totalTTC: this.invoice.totalTTC,
        taxe: this.invoice.totalTTC - this.invoice.totalHT,
        statut: 'brouillon'
      };

      this.invoiceService.addInvoice(this.invoice).subscribe(() => {
        this.router.navigate(['/dash/factures']);
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  cancel(): void {
    this.router.navigate(["/dash/factures"]);
  }
}