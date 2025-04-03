import { Component, ElementRef, ViewChild } from '@angular/core';
import { Devis, DevisService, StatutDevis } from '../../../services/devis.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe,
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
    IconFieldModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  devis: Devis[] = []
  devisFiltres: Devis[] = []
  searchTerm = ""
  filterValue = ""
  statutOptions = Object.values(StatutDevis)
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private devisService: DevisService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.chargerDevis()
    this.loading = false;
  }

  chargerDevis(): void {
    this.devisService.getDevis().subscribe((devis) => {
      this.devis = devis
    })
  }


  nouveauDevis(): void {
    this.router.navigate(["/dash-client/devis/new"])
  }

  voirDevis(id: string): void {
    this.router.navigate(["/dash-client/devis", id])
  }

  modifierDevis(id: number): void {
    this.router.navigate(["/dash-client/devis", id, "modifier"])
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(etat: string) {
    switch (etat) {
        case 'Facturé':
            return 'success';

        case 'Confirmé':
            return 'warn';

        case 'Annulé':
            return 'danger';

        default:
            return 'info';
    }
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}

