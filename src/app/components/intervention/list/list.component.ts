import { Component } from '@angular/core';
import { Intervention, InterventionService, InterventionStats } from '../../../services/intervention.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { NewInterventionComponent } from '../new/new.component';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    IconFieldModule,
    NewInterventionComponent,
    ReactiveFormsModule
    ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListInterventionComponent {
    interventions: Intervention[] = [];
    filteredInterventions: Intervention[] = [];
    stats: InterventionStats = { total: 0, enCours: 0, fini: 0, enAttente: 0 };
    searchControl = new FormControl('');
    siteFilter = new FormControl('');
    showNewInterventionForm = false;

    constructor(private interventionService: InterventionService) {}

    ngOnInit(): void {
      this.loadInterventions();
      this.loadStats();
      this.searchControl.valueChanges.subscribe(value => {
        this.filterInterventions();
      });

      this.siteFilter.valueChanges.subscribe(value => {
        this.filterInterventions();
      });
    }

    loadInterventions(): void {
      this.interventionService.getInterventions().subscribe(data => {
        this.interventions = data;
        this.filteredInterventions = data;
      });
    }

    loadStats(): void {
        this.interventionService.getInterventionStats().subscribe(stats => {
          this.stats = stats;
        });
    }

    filterInterventions(): void {
      const searchTerm = this.searchControl.value?.toLowerCase() || '';
      const site = this.siteFilter.value;

      this.filteredInterventions = this.interventions.filter(intervention => {
        const matchesSearch = !searchTerm ||
          intervention.client.toLowerCase().includes(searchTerm) ||
          intervention.vehicule.toLowerCase().includes(searchTerm) ||
          intervention.type.toLowerCase().includes(searchTerm);

        const matchesSite = !site || true; // Ajoutez la logique de filtrage par site si nécessaire

        return matchesSearch && matchesSite;
      });
    }

    toggleNewInterventionForm(): void {
      this.showNewInterventionForm = !this.showNewInterventionForm;
    }
  }