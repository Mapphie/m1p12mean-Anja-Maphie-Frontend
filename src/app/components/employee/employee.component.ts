import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-employee',
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
    BadgeModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit{
    customers3: any[] = [];
    @ViewChild('dt') dt!: Table;


    ngOnInit() {
    this.customers3 = [
      {
        name: "John Doe",
        email: "john@gmail.com",
        Contact: "012320145",
        status: "Active",
        date: "2024-03-14",
        poste:"Mécanicien",
        salaire:"300 000 AR",
        intervention:"5"
      },
      {
        name: "Jane Smith",
        email: "jane@gmail.com",
        Contact: "017820145",
        status: "Inactive",
        date: "2024-02-10",
        poste:"Manager",
        salaire :"500 000 AR",
        intervention:""
      },
      {
        name: "Anne Marie",
        email: "marie@gmail.com",
        Contact: "017828545",
        status: "Active",
        date: "2024-02-10",
        poste:"Manager",
        salaire :"500 000 AR",
        intervention:""
      }
    ];
  }

    getSeverity(status: string) {
        switch (status) {
            case 'Active':
                return 'success';

            case 'Inactive':
                return 'danger';

            default:
                return 'secondary';

        }
    }

    getPoste(poste: string) {
        switch (poste) {
            case 'Manager':
                return 'danger';

            default:
                return 'warn';

        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }



}
