import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { AuthReg } from './authreg';
import { LogReg } from './logreg';
import { LoginRegisterComponent } from './../../components/login-register/login-register.component';
import { RegisterComponent } from './../../components/register/register.component';
import { NewloginComponent } from './../../components/newlogin/newlogin.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'authreg', component: AuthReg },
    { path: 'logreg', component: LogReg },
    // { path: 'loginregister', component: LoginRegisterComponent },
    { path: 'loginregister/:action', component: LoginRegisterComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'newlogin', component: NewloginComponent },
] as Routes;
