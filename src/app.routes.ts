import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { EmployeeComponent } from './app/components/employee/employee.component';
import { ClientsComponent } from './app/components/clients/clients.component';
import { ListComponent } from './app/components/devis/list/list.component';
import { DevisComponent } from './app/components/devis/details/devis.component';
import { NewComponent } from './app/components/devis/new/new.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path:'employes', component:EmployeeComponent },
            { path:'clients', component:ClientsComponent },
            { path:'devis', component:ListComponent },
            { path:'devis/new', component:NewComponent },
            { path:'devis/:id', component:DevisComponent },

            
        
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
