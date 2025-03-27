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
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';

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
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    InputMaskModule,
    TextareaModule,
    CalendarModule,
    ReactiveFormsModule
  ],
  templateUrl: './rendez-vous.component.html',
  styleUrl: './rendez-vous.component.scss'
})
export class RendezVousComponent {
  rendezVous: RendezVous[] = [];
  loading: boolean = true;
  statuses: any[] = [];
  rdvDialog : boolean = false;
  selectedRdv: any = null;
  clients: any[] = [];

  updatingDialog : boolean = false;
  isEdit = false;
  serviceOptions: any[] = [];
  rdvForm: FormGroup;

  @ViewChild('filter') filter!: ElementRef;

  constructor(
      private rendezVousService: RendezVousService,
      private router: Router,
      private fb: FormBuilder
  ) {
    this.rdvForm = this.fb.group({
      client: ['', Validators.required],
      service: [[], Validators.required],
      date: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [''],
      etat: ['', Validators.required]
    });
  }

  ngOnInit() {
      this.rendezVousService.getAllData().then((data) => {
          this.rendezVous = data;
          this.loading = false;


          // @ts-ignore
          this.rendezVous.forEach((data) => (data.date = new Date(data.date)));
      });

      this.statuses = [
          { label: 'Annulé', value: 'annulé' },
          { label: 'Confirmé', value: 'confirmé' },
          { label: 'En attente', value: 'en attente' }
      ];

      this.serviceOptions = [
        { label: "Changement d'huile", value: "Changement d'huile" },
        { label: "Remplacement des freins", value: "Remplacement des freins" },
        { label: "Révision complète", value: "Révision complète" }
    ];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(etat: string) {
      switch (etat) {
          case 'annulé':
              return 'danger';
          case 'en attente':
            return 'info';
          default:
              return 'success';
      }
  }

  getSeverityIcon(etat: string): string {
    switch (etat) {
        case 'annulé':
            return 'pi pi-times'; // Icône d'annulation
        case 'en attente':
            return 'pi pi-clock'; // Icône d'attente
        default:
            return 'pi pi-check'; // Icône de validation
    }
}

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  getDetails(rdv:RendezVous) {
    this.selectedRdv = rdv;
    this.rdvDialog = true;
  }

  hideDialog() {
    this.rdvDialog = false;
  }

  getClient(clientNumber: string) {
    return this.rendezVousService.getClientDetails(clientNumber);
  }

  UpdateRdvDialog(edit = false, rdv: RendezVous | null = null){
    this.selectedRdv = rdv;
    this.rdvDialog = false;
    this.updatingDialog = true;

    console.log(rdv);

    this.isEdit = edit;
    if (edit && rdv) {
      this.rdvForm.patchValue({
          client: rdv.client,
          service: rdv.service,
          date: rdv.date,
          startTime: rdv.startTime,
          endTime: rdv.endTime,
          description: rdv.description,
          etat: rdv.etat
      });
    } else {
        this.rdvForm.reset();
    }
  }

  onSubmit() {
    if (this.rdvForm.valid) {
      console.log('Formulaire soumis :', this.rdvForm.value);
      this.updatingDialog = false;
    }
  }


  closeUpdatingDialog(){
    this.updatingDialog = false;
  }

}
