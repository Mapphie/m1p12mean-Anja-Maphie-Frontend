import { Employe, EmployeService } from './../../services/employe.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  providers: [MessageService, EmployeService, ConfirmationService]
})
export class EmployeeComponent implements OnInit{
    employeDialog: boolean = false;
    @ViewChild('dt') dt!: Table;

    submitted: boolean = false;

    employe!: Employe;

    employes: Employe[] = [];
    postes!: any[];

    // newEmploye={nom: '',email: '',contact: '',adresse: '',poste: '',salaire: 0,etat: 'Active'};

    editedEmploye: any = null;

    constructor(
        private employeService: EmployeService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadDemoData();
        this.loadEmployes();
    }

    getSeverity(etat: string) {
        switch (etat) {
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

    loadEmployes(): void{
        this.employeService.getAllEmployes().subscribe(data => this.employes = data);
    }

    loadDemoData() {

        this.postes = [
          { label: 'Mécanicien', value: 'Mécanicien' },
          { label: 'Manager', value: 'Manager' }
      ];


    }

    openNewEmploye() {
        this.employe = {_id:'',nom: '',
          email: '',
          contact: '',
          adresse: '',
          poste: '',
          salaire: 0,
          intervention: 0,
          date: new Date(),
          etat: 'Active'};
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

    deleteEmploye(employe: Employe) {

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + employe.nom + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employeService.deleteEmploye(employe._id).subscribe(() =>  this.loadEmployes());

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Deleted',
                    life: 3000
                });
            }
        });
    }

    addEmploye(): void{
        console.log('add employe');
        
        if(this.employe.nom && this.employe.email && this.employe.contact && this.employe.adresse && this.employe.poste && this.employe.salaire){
            this.employeService.addEmploye(this.employe).subscribe(() =>{
            this.loadEmployes();
            });
        }
    }

    getEditedEmploye(employe: any): void {
        this.editedEmploye = { ...employe }; // Copie de l'employe pour modification
    }

    updateEmploye(): void {
        console.log('update employe');
        
        if (this.employe && this.employe._id) {
          this.employeService.updateEmploye(this.employe._id, this.employe).subscribe(() => {
            this.loadEmployes();
          });
        }
    }

    saveEmploye() {
        console.log('Save Employe');
        
        this.submitted = true;
        console.log(`employe : `, this.employe);
        if (this.employe._id) {
            this.updateEmploye();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employé modifié',
                life: 3000
            });
        } else {
            this.addEmploye();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employé ajouté',
                life: 3000
            });
        }
    
        this.employeDialog = false;
        
    }


}
