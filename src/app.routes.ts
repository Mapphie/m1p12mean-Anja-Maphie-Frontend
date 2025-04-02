import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { AppLayout as ClientLayout } from './app/layout/component-client/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { EmployeeComponent } from './app/components/employee/employee.component';
import { ClientsComponent } from './app/components/clients/clients.component';
import { DashClientComponent } from './app/components/dash-client/dash-client.component';
import { ClientDevisComponent } from './app/components/client-devis/client-devis.component';


export const appRoutes: Routes = [
    {
        path: 'dash',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'employes', component: EmployeeComponent },
            { path: 'clients', component: ClientsComponent }

        ]
    },
    {
        path: 'dash-client',
        component: ClientLayout,
        children: [
            { path: '', component: DashClientComponent },
            { path: 'devis', component: ClientDevisComponent },
            // { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            // { path: 'documentation', component: Documentation },
            // { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            // { path: 'employes', component: EmployeeComponent },
            // { path: 'clients', component: ClientsComponent }

        ]
    },
    { path: '', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' },
];
