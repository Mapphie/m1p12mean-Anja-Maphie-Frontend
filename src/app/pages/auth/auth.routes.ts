import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { AuthReg } from './authreg';
import { LogReg } from './logreg';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'authreg', component: AuthReg },
    { path: 'logreg', component: LogReg },
] as Routes;
