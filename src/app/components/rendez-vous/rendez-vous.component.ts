import { Component, ElementRef, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { RendezVous, RendezVousService } from '../../services/rendez-vous.service';
import { Client, ClientsService } from '../../services/clients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-rendez-vous',
  imports: [
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
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    InputMaskModule,
    TextareaModule,
    CalendarModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ChipModule 
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './rendez-vous.component.html',
  styleUrl: './rendez-vous.component.scss'
})
export class RendezVousComponent {
  clientNumber: string = ''
  rendezVous: RendezVous[] = []
  loading = false
  rdvDialog = false
  updatingDialog = false
  isEdit = false
  selectedRdv: RendezVous = {} as RendezVous;
  rdvForm: FormGroup
  minDate: Date = new Date()

  clientOptions: any[] = []
  serviceOptions: any[] = []
  statuses: any[] = [
    { name: "Planifié", code: "planifie" },
    { name: "En cours", code: "en_cours" },
    { name: "Terminé", code: "termine" },
    { name: "Annulé", code: "annule" },
  ]

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private rdvService: RendezVousService,
    private clientService: ClientsService,
    private route: ActivatedRoute
  ) {
    this.rdvForm = this.fb.group({
      client: ["", Validators.required],
      service: [[], Validators.required],
      date: [null, Validators.required],
      startTime: ["", [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      endTime: ["", [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      description: [""],
      etat: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.clientNumber = this.route.snapshot.paramMap.get('id')!;
    console.log('client Number : ', this.clientNumber);

    this.loadData()
    this.loadClients()
    this.loadServices()
  }

  loadData(): void {
    this.loading = true

    // Exemple de données - à remplacer par votre appel API
    setTimeout(() => {
      const rdvData = this.rdvService.getRdvByClient(this.clientNumber);
      console.log('RDV DATA : ', rdvData);
      
      this.rendezVous = rdvData ? [rdvData] : [];

      this.loading = false
    }, 1000)
  }

  loadClients(): void {
    // Exemple de données - à remplacer par votre appel API
    this.clientOptions = this.clientService.getData()
  }

  loadServices(): void {
    // Exemple de données - à remplacer par votre appel API
    this.serviceOptions = [
      { name: "Changement d'huile", code: "SRV001" },
      { name: "Révision", code: "SRV002" },
      { name: "Diagnostic électronique", code: "SRV003" },
      { name: "Changement des plaquettes et disques", code: "SRV004" },
      { name: "Équilibrage des roues", code: "SRV005" },
      { name: "Remplacement des freins", code: "SRV006" },

    ]
  }

  getClient(clientCode: string): any {
    return this.clientOptions.find((c) => c.number === clientCode) || { nom: clientCode, contact: "N/A" }
  }

  getClientName(clientCode: string): string {
    const client = this.clientOptions.find((c) => c.number === clientCode)
    return client ? client.nom : clientCode
  }

  getSeverity(status: string){
    switch (status) {
      case 'en cours':
        return 'warn'
      case 'confirmé':
        return 'success'
      case 'annulé':
        return 'danger'
      default:
        return 'info'
    }
  }

  getSeverityIcon(status: string){
    switch (status) {
      case "confirmé":
        return "pi-calendar"
      case "en cours":
        return "pi-sync"
      case "terminé":
        return "pi-check-circle"
      case "annulé":
        return "pi-times-circle"
      default:
        return "pi-calendar"
    }
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains")
  }

  clear(table: Table): void {
    table.clear()
    const input = document.querySelector(".p-inputtext") as HTMLInputElement
    if (input) {
      input.value = ""
    }
  }

  getDetails(rdv: RendezVous): void {
    this.selectedRdv = rdv
    this.rdvDialog = true
  }

  UpdateRdvDialog(isEdit: boolean, rdv?: RendezVous): void {
    this.isEdit = isEdit

    if (isEdit && rdv) {
      this.rdvForm.patchValue({
        client: rdv.client,
        service: rdv.service,
        date: new Date(rdv.date),
        startTime: rdv.startTime,
        endTime: rdv.endTime,
        description: rdv.description,
        etat: rdv.etat,
      })
    } else {
      this.rdvForm.reset()

      const defaultClient = this.clientNumber ? this.clientNumber : null;
      // Valeurs par défaut
      this.rdvForm.patchValue({
        client: defaultClient,
        date: new Date(),
        etat: "Planifié",
      })

      if (this.clientNumber) {
        this.rdvForm.get('client')?.disable();
      }
    }
    

    this.updatingDialog = true
    if (this.rdvDialog) {
      this.rdvDialog = false
    }
  }

  closeUpdatingDialog(): void {
    this.updatingDialog = false
    this.rdvForm.reset()
  }

  onSubmit(): void {
    if (this.rdvForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.rdvForm.controls).forEach((key) => {
        const control = this.rdvForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    const formData = this.rdvForm.value

    if (this.isEdit) {
      // Mise à jour d'un rendez-vous existant
      const index = this.rendezVous.findIndex((rdv) => rdv.number === this.selectedRdv.number)
      if (index !== -1) {
        this.rendezVous[index] = {
          ...this.selectedRdv,
          ...formData,
        }
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Rendez-vous mis à jour",
          life: 3000,
        })
      }
    } else {
      // Création d'un nouveau rendez-vous
      const newRdv = {
        number: this.generateId(),
        ...formData,
      }
      this.rendezVous.push(newRdv)
      this.messageService.add({
        severity: "success",
        summary: "Succès",
        detail: "Rendez-vous créé",
        life: 3000,
      })
    }

    this.closeUpdatingDialog()
  }

  generateId(): string {
    const id = Math.floor(Math.random() * 1000) + 10;
  // Formater l'ID en ajoutant le préfixe "RDV" et en remplissant de zéros pour atteindre 4 chiffres
    return `RDV${id.toString().padStart(4, '0')}`;
  }

  confirmDelete(rdv: any): void {
    this.confirmationService.confirm({
      message: "Êtes-vous sûr de vouloir supprimer ce rendez-vous ?",
      accept: () => {
        this.rendezVous = this.rendezVous.filter((r) => r.number !== rdv.number)
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Rendez-vous supprimé",
          life: 3000,
        })
        if (this.rdvDialog) {
          this.rdvDialog = false
        }
      },
    })
  }
}

