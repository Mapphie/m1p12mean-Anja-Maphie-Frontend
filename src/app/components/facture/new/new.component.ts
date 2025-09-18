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
import { User, UserService } from '../../../services/user.service';

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
  defaultManagerEmail = 'miradoranaivo@gmail.com';
  defaultManager: User = {} as User;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private clientService: ClientsService,
    private serviceService: ServiceService,
    private vehiculeService: ClientVehiculeService,
    private userService: UserService,
    private router: Router,
  ) {
    this.invoiceForm = this.fb.group({
      number: ['FAC0001', Validators.required],
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
    this.generateInvoiceNumber();
    this.loadClients();
    this.loadServices();
    this.loadVehicules();
    this.addItem();
    this.loadDefaultManager();
  }

  get lignesFormArray(): FormArray {
    return this.invoiceForm.get('lignes') as FormArray;
  }

  generateInvoiceNumber(): void {
    this.invoiceService.getLastInvoice().subscribe((lastInvoice) => {
        let newNumber = 'FAC-2025-001'; // valeur par défaut

        if (lastInvoice && lastInvoice.number) {
          const lastNumber = lastInvoice.number; // ex: FAC-2025-003

          // Extraire l’année et la partie numérique
          const parts = lastNumber.split('-'); // ["FAC", "2025", "003"]
          const year = parts[1];
          const numericPart = parseInt(parts[2], 10) || 0;

          // Vérifier si on est toujours sur la même année
          const currentYear = new Date().getFullYear().toString();

          let nextNumber: number;
          if (year === currentYear) {
            // Même année -> on incrémente
            nextNumber = numericPart + 1;
          } else {
            // Nouvelle année -> on redémarre à 1
            nextNumber = 1;
          }

          // Générer le nouveau code
          newNumber = `FAC-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
        }

        this.invoiceForm.patchValue({ number: newNumber });
        console.log('Generated invoice number:', newNumber);
      });
  }


  createItemFormGroup(): FormGroup {
    return this.fb.group({
        selectedService: ['', Validators.required],
        serviceObj: [null],
        prixUnitaireHT: [0, [Validators.required, Validators.min(0)]],
        quantite: [1, [Validators.required, Validators.min(0)]],
        taxe: [20],
        totalHT: [{ value: 0, disabled: true }],
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

  onServiceChange(index: number): void {
    const ligneForm = this.lignesFormArray.at(index) as FormGroup;
    const serviceId = ligneForm.get("selectedService")?.value;

    if (serviceId) {
      this.serviceService.getServiceById(serviceId).subscribe(service => {
        if (service) {
          ligneForm.patchValue({
            // serviceNom: service.nom,
            prixUnitaireHT: service.prix,
            serviceObj: service,

          });
          this.updateItemAmount(index);
        }
      }, error => {
        console.error('Erreur lors de la récupération du service:', error);
      });
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
    const taxe = itemGroup.get('taxe')?.value || 20;

    const totalHT = prix * quantite;
    const totalTTC = totalHT * (1 + taxe / 100);

    itemGroup.get('totalHT')?.setValue(parseFloat(totalHT.toFixed(2)));
    itemGroup.get('totalTTC')?.setValue(parseFloat(totalTTC.toFixed(2)));

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

  loadDefaultManager(): void{
    this.userService.getUserByEmail(this.defaultManagerEmail).subscribe({
        next: (user) => {
          this.defaultManager = user
            console.log("Default Manager : ",this.defaultManager);
        },
        error: (err) => console.error('Impossible de récupérer le manager par défaut:', err)
      });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid && this.selectedClient && this.selectedVehicule) {
        // Construire l'objet invoice à partir du formulaire
        const formValue = this.invoiceForm.value;

        // Calculer les lignes et totaux localement avant de créer l'objet invoice
        const lignes = formValue.lignes?.map((ligne: any) => {
            const totalHT = ligne.prixUnitaireHT * ligne.quantite;
            const totalTTC = totalHT * (1 + (ligne.taxe || 20) / 100);

            return {
            service: ligne.serviceObj._id,
            prixUnitaireHT: ligne.prixUnitaireHT,
            quantite: ligne.quantite,
            taxe: ligne.taxe || 20,
            remise: 0,
            description: ligne.description || ligne.serviceNom,
            totalHT,
            totalTTC,
            };
        }) || [];

      const totalHT = lignes.reduce((sum: any, l: { totalHT: any; }) => sum + l.totalHT, 0);
      const totalTTC = lignes.reduce((sum: any, l: { totalTTC: any; }) => sum + l.totalTTC, 0);

      this.invoice = {
        number: formValue.number,
        dateCreation: new Date(formValue.dateCreation),
        client: this.selectedClient,
        vehicule: this.selectedVehicule,
        manager: this.defaultManager,
        lignes,
        totalHT,
        totalTTC,
        etat: 'Brouillon',
      };


        console.log('Payload envoyé:', JSON.stringify(this.invoice, null, 2));

        this.invoiceService.addInvoice(this.invoice).subscribe({
          next: () => {
            this.router.navigate(['/dash/factures']);
          },
          error: (error) => {
            console.log(this.invoice)
            console.error('Erreur lors de la création de la facture:', error);
            alert('Erreur lors de la création de la facture.');
          }
        });
      } else {
        alert('Veuillez remplir tous les champs requis et sélectionner un client et un véhicule.');
      }
  }

  cancel(): void {
    this.router.navigate(["/dash/factures"]);
  }

  checkFormErrors(): void {
    console.log('Form valid:', this.invoiceForm.valid);
    console.log('Form errors:', this.invoiceForm.errors);

    // Vérifier chaque contrôle du formulaire principal
    Object.keys(this.invoiceForm.controls).forEach(key => {
      const control = this.invoiceForm.get(key);
      if (control && control.invalid) {
        console.log(`${key} is invalid:`, control.errors);
      }
    });

    // Vérifier les lignes du FormArray
    this.lignesFormArray.controls.forEach((ligneControl, index) => {
      if (ligneControl.invalid) {
        console.log(`Ligne ${index} is invalid:`, ligneControl.errors);

        // Vérifier chaque champ de la ligne
        Object.keys((ligneControl as FormGroup).controls).forEach(fieldKey => {
          const fieldControl = ligneControl.get(fieldKey);
          if (fieldControl && fieldControl.invalid) {
            console.log(`  - ${fieldKey} is invalid:`, fieldControl.errors);
          }
        });
      }
    });
  }

}