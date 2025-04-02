import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dash'] }]
            },
            {
                label: 'Utilisateurs',
                items: [
                    { label: 'Employés', icon: 'pi pi-fw pi-users', routerLink: ['/dash/employes'] },
                    { label: 'Clients', icon: 'pi pi-fw pi-address-book', routerLink: ['/dash/clients'] },

                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    { label: 'Rendez-vous', icon: 'pi pi-fw pi-calendar-clock', routerLink: ['/dash/rendez-vous'] },
                    { label: 'Devis', icon: 'pi pi-fw pi-file', routerLink: ['/dash/devis'] },
                    { label: 'Factures', icon: 'pi pi-receipt', routerLink: ['/dash/factures'] },

                ]
            },
            {
                label: 'Informations',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'Source Front',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/Mapphie/m1p12mean-Anja-Maphie-Frontend',
                        target: '_blank'
                    },
                    {
                        label: 'Source Back',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/Mapphie/m1p12mean-Anja-Maphie-Backend',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
