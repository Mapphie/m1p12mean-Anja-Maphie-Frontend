import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { EmployeeComponent } from './app/components/employee/employee.component';
import { ClientsComponent } from './app/components/clients/clients.component';
import { RendezVousComponent } from './app/components/rendez-vous/rendez-vous.component';
import { InvoiceListComponent } from './app/components/facture/list/list.component';
import { DetailComponent } from './app/components/facture/detail/detail.component';
import { NewInvoiceComponent } from './app/components/facture/new/new.component';
import { InvoiceEditComponent } from './app/components/facture/update/update.component';
import { ListComponent } from './app/components/devis/list/list.component';
import { DevisComponent } from './app/components/devis/details/devis.component';
import { NewComponent } from './app/components/devis/new/new.component';
import { UpdateQuoteComponent } from './app/components/devis/update/update.component';

export const appRoutes: Routes = [
    {
        path: 'dash',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path:'employes', component:EmployeeComponent },
            { path:'clients', component:ClientsComponent },
            { path:'rendez-vous', component: RendezVousComponent},

            { path:'factures', component:InvoiceListComponent },
            { path:'factures/nouveau', component:NewInvoiceComponent },
            { path:'factures/:id', component:DetailComponent },
            { path:'factures/update/:id', component:InvoiceEditComponent },

            { path:'devis', component:ListComponent },
            { path:'devis/new', component:NewComponent },
            { path:'devis/:id', component:DevisComponent },
            { path:'devis/update/:id', component:UpdateQuoteComponent },

        ]
    },
    { path: '', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
