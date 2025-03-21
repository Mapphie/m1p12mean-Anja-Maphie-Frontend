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
import { Client, ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-clients',
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
    IconFieldModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    customers1: Client[] = [];

    loading: boolean = true;

    statuses: any[] = [];

    @ViewChild('filter') filter!: ElementRef;


    constructor(
            private clientsService: ClientsService
        ) {}

    ngOnInit() {
        this.clientsService.getCustomers().then((customers) => {
            this.customers1 = customers;
            this.loading = false;


            // @ts-ignore
            this.customers1.forEach((customer) => (customer.date = new Date(customer.date)));
        });

        this.statuses = [
            { label: 'Actif', value: 'actif' },
            { label: 'Inactif', value: 'inactif' }
        ];

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverity(etat: string) {
        switch (etat) {
            case 'inactif':
                return 'danger';

            default:
                return 'success';
        }
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

}
