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
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { RendezVous, RendezVousService } from '../../services/rendez-vous.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

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
    DialogModule
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

  @ViewChild('filter') filter!: ElementRef;

  constructor(
      private rendezVousService: RendezVousService,
      private router: Router
  ) {}
  
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

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  getDetails(rdv:any) {
    this.selectedRdv = rdv;
    this.rdvDialog = true;
  }

  hideDialog() {
    this.rdvDialog = false;
  }

  getClient(clientNumber: string) {
    return this.rendezVousService.getClientDetails(clientNumber);
  }

}
