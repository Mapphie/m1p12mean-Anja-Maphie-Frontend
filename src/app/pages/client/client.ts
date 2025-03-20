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


@Component({
    selector: 'app-panels-demo',
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
        MenubarModule
    ],
    template: `
        <div class="flex flex-col">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Nom du Client</div>
                
            </div>

            <div class="flex flex-col md:flex-row h-screen">
                <!-- Accordion prend 1/4 de la largeur -->
                <div class="md:w-1/4 h-full">
                    <div class="card h-full p-4">
                        <div class="font-semibold text-sm mb-4">Ville :</div>
                        <p class="text-lg mb-4"> ...</p>

                        <div class="font-semibold text-sm mb-4">Adresse :</div>
                        <p class="text-lg mb-4">... </p>

                        <div class="font-semibold text-sm mb-4">Email :</div>
                        <p class="text-lg mb-4">... </p>

                        <div class="font-semibold text-sm mb-4">Contact :</div>
                        <p class="text-lg mb-4">... </p>
           
                    </div>
                </div>

                <!-- Panel prend le reste de l'espace -->
                <div class="md:w-3/4 h-full">
                    <div class="card h-full p-4">
                        <div class="font-semibold text-xl mb-4">Menubar</div>
                        <p-menubar [model]="nestedMenuItems">
                            
                        </p-menubar>
                    </div>
                </div>
            </div>

            

            `
})
export class Clients {
    nestedMenuItems = [
        {
            label: 'Véhicule',
            icon: 'pi pi-fw pi-table',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',
                    items: [
                        {
                            label: 'Customer',
                            icon: 'pi pi-fw pi-plus'
                        },
                        {
                            label: 'Duplicate',
                            icon: 'pi pi-fw pi-copy'
                        }
                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-user-edit'
                }
            ]
        },
        {
            label: 'Rendez-vous',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'Devis',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'Tracker',
                    icon: 'pi pi-fw pi-compass'
                },
                {
                    label: 'Map',
                    icon: 'pi pi-fw pi-map-marker'
                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil'
                }
            ]
        },
        {
            label: 'Facture',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog'
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-file'
                }
            ]
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-sign-out'
        }
    ];
}
