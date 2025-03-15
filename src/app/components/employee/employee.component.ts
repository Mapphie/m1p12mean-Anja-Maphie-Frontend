import { Employe, EmployeService } from './../../services/employe.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    BadgeModule,
    DialogModule,
    ConfirmDialogModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit{
    customers3: any[] = [];
    employeDialog: boolean = false;
    @ViewChild('dt') dt!: Table;

    submitted: boolean = false;

    employe!: Employe;

    postes!: any[];

    constructor(
        private employeService: EmployeService
    ) {}

    ngOnInit() {
    this.customers3 = [
      {
        nom: "John Doe",
        email: "john@gmail.com",
        contact: "012320145",
        adresse:"Lot TT 124 Ivato",
        status: "Active",
        date: "2024-03-14",
        poste:"Mécanicien",
        salaire:"300 000 AR",
        intervention:"5"
      },
      {
        nom: "Jane Smith",
        email: "jane@gmail.com",
        adresse:"Lot TT 124 Ivato",
        contact: "017820145",
        status: "Inactive",
        date: "2024-02-10",
        poste:"Manager",
        salaire :"500 000 AR",
        intervention:""
      },
      {
        nom: "Anne Marie",
        email: "marie@gmail.com",
        contact: "017828545",
        adresse:"Lot TT 124 Ivato",
        status: "Active",
        date: "2024-02-10",
        poste:"Manager",
        salaire :"500 000 AR",
        intervention:""
      }
    ];

    this.loadDemoData();
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

    loadDemoData() {

      this.postes = [
          { label: 'Mécanicien', value: 'Mécanicien' },
          { label: 'Manager', value: 'Manager' }
      ];

    }

    openNewEmploye() {
        this.employe = {id: 1,
          nom: '',
          email: '',
          contact: '',
          adresse: '',
          poste: '',
          salaire: 0,
          etat: 1};
        this.submitted = false;
        this.employeDialog = true;
    }

    hideDialog() {
      this.employeDialog = false;
      this.submitted = false;
    }

    editEmploye(employe: Employe) {
      this.employe = { ...employe };
      this.employeDialog = true;
    }

}
