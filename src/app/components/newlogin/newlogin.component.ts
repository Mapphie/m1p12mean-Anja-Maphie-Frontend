import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { Router, RouterModule } from '@angular/router';
import { User, UserService } from './../../services/user.service';


@Component({
    selector: 'app-newlogin',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator,
        DividerModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        MessageModule
    ],
    templateUrl: './newlogin.component.html',
    styleUrl: './newlogin.component.scss'
})
export class NewloginComponent {
    users: any[] = [];
    constructor(private userService: UserService, private router: Router) { }

    datalog = { email: '', password: '' };
    errorMessage = "";

    loginregister(): void {
        if (this.datalog.email && this.datalog.password) {
            this.userService.sendtolog(this.datalog.email, this.datalog.password).subscribe({
                next: (response) => {
                    // Si la réponse est réussie (code 200)
                    if (response.success) {
                        console.log('Connexion réussie:', response.message);
                        // Ici tu peux par exemple rediriger l'utilisateur ou stocker des données dans le sessionStorage/localStorage
                        this.router.navigate(['/dash-client']);
                    } else {
                        console.error('Erreur de connexion:', response.message);
                        // Afficher un message d'erreur à l'utilisateur
                        this.errorMessage = response.message;
                    }
                },
                error: (err) => {
                    // Si une erreur se produit lors de la requête HTTP
                    console.error('Erreur lors de la requête:', err);
                    // Afficher un message d'erreur générique
                }
            });
        }
    }
}
