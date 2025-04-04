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
import { Client, ClientsService } from '../../../services/clients.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';


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
    IconFieldModule,
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    DropdownModule,
  ],
  providers: [ConfirmationService, MessageService],

  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    client: Client = {} as Client
    customers1: Client[] = [];

    loading: boolean = true;

    statuses: any[] = [];
    selectedClient! : Client;
    clientDialog = false
    isEdit = false
    clientForm: FormGroup
    submitted : boolean = false;

    editedClient: any = null;


    @ViewChild('filter') filter!: ElementRef;


    constructor(
            private clientsService: ClientsService,
            private router: Router,
            private fb: FormBuilder,
            private confirmationService: ConfirmationService,
            private messageService: MessageService,
        ) {
            this.clientForm = this.fb.group({
                nom: ["", Validators.required],
                adresse: [[], Validators.required],
                date: [null, Validators.required],
                ville: [null, Validators.required],
                contact: [""],
                etat: ["", Validators.required],
            })
        }

    ngOnInit() {

        this.loadClient()
        this.statuses = [
            { label: 'Actif', value: 'actif' },
            { label: 'Inactif', value: 'inactif' }
        ];

    }

    loadClient(){
        this.clientsService.getClients().subscribe((customers) => {
            this.customers1 = customers;
            this.loading = false;

        });
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

    goToCustomerDetails(ClientNumber : string) {
        this.router.navigate(['/dash/client', ClientNumber]);
    }

    openNewClient() {
        this.client = {nom: '',
        email: '',
        contact: '',
        adresse: '',
        idrole: {
            _idrole: '',
            role: ''
        },
        password:''}
        this.submitted = false;
        this.clientDialog = true;
    }


    editClient(client: Client) {
        this.client = { ...client };
        this.clientDialog = true;
    }

    deleteClient(client: Client) {

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + client.nom + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.clientsService.deleteClient(client._id!).subscribe(() =>  this.loadClient());

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Client Archivé',
                    life: 3000
                });
            }
        });
    }

    addClient(): void{
        this.clientsService.addClient(this.client).subscribe(() =>{
            this.loadClient();
            });

    }

    getEditedClient(client: any): void {
        this.editedClient = { ...client }; // Copie de l'employe pour modification
    }

    updateClient(): void {
        console.log('update employe');

        if (this.client && this.client._id!) {
            this.clientsService.updateClient(this.client._id!, this.client).subscribe(() => {
            this.loadClient();
            });
        }
    }

    saveClient() {
        console.log('Save Employe');

        this.submitted = true;
        console.log(`client : `, this.client);
        if (this.client._id!) {
            this.updateClient();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employé modifié',
                life: 3000
            });
        } else {
            this.addClient();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employé ajouté',
                life: 3000
            });
        }

        this.clientDialog = false;

    }


    closeDialog(){
        this.clientDialog = false;
        this.submitted = false;
    }

}
