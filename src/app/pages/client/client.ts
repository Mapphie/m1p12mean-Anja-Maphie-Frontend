import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';
import { StatsClient } from './statsclients';
import { Router, RouterLink } from '@angular/router';


@Component({
    selector: 'app-client-details',
    standalone: true,
    imports: [
    CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        SplitButtonModule,
        AccordionModule,
        FieldsetModule,
        MenuModule,
        InputTextModule,
        DividerModule,
        SplitterModule,
        PanelModule,
        TabsModule,
        IconFieldModule,
        InputIconModule,
        MenubarModule,
        StatsClient
    ],
    template: `
        <div class="flex flex-col">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Nom du Client</div>

            </div>

            <div class="flex flex-col md:flex-row h-screen">
                <!-- Accordion prend 1/4 de la largeur -->
                <div class="md:w-1/4 h-full">
                    <div class="bg-white shadow-lg rounded-lg p-6 border border-gray-200 h-full">
                        <h2 class="text-xl font-bold text-blue-600 mb-4">Informations</h2>

                        <div class="space-y-4">
                        <div class="flex items-center space-x-2">
                            <p-button icon="pi pi-map" severity="info" text raised rounded />
                            <span class="font-semibold text-lg text-black-700">Ville :</span>
                        </div>

                        <div class="flex items-center space-x-2">
                            <p-button icon="pi pi-map-marker" severity="info" text raised rounded />
                            <span class="font-semibold text-lg text-black-700">Adresse :</span>
                        </div>
                        

                        <div class="flex items-center space-x-2">
                            <p-button icon="pi pi-envelope" severity="info" text raised rounded />
                            <span class="font-semibold text-lg text-black-700">Email :</span>
                        </div>
                        

                        <div class="flex items-center space-x-2">
                            <p-button icon="pi pi-phone" severity="info" text raised rounded />
                            <span class="font-semibold text-lg text-black-700">Contact :</span>
                        </div>
                        
                        </div>
                        <hr class="mt-6 border-t border-gray-300">
                        <p-button label="Modifier" icon="pi pi-pencil"severity="secondary"  />
                    </div>
                </div>
 
                <!-- Panel prend le reste de l'espace -->
                <div class="md:w-3/4 h-full flex flex-col ml-4">
                    <div class="card p-4">
                        <p-menubar [model]="nestedMenuItems" class="w-full"></p-menubar>
                    </div>
                    <div class="grid ">
                        <app-stats-client *ngIf="showStatClient" class="w-full"></app-stats-client>
                    </div>
                </div>
            </div>



            `
})
export class Clients {
    showStatClient: boolean = true;
    showCarList: boolean = false;

    constructor(
        private router: Router
    ) {}

    nestedMenuItems = [
        {
            label: 'Véhicule',
            icon: 'pi pi-fw pi-car',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },
                
            ]
        },
        {
            label: 'Rendez-vous',
            icon: 'pi pi-fw pi-calendar-clock',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },
                
            ]
        },
        {
            label: 'Devis',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },
            ]
        },
        {
            label: 'Facture',
            icon: 'pi pi-fw pi-receipt',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },
            ]
        },
        {
            label: 'Retour',
            icon: 'pi pi-fw pi-arrow-circle-left',
            command: ()=>{
                this.router.navigate(['/clients']);
            }
        }
    ];
}
