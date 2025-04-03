import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule ,Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { DividerModule } from 'primeng/divider';


import { User, UserService } from './../../services/user.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator,
        DividerModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    users: any[] = [];
    constructor(private userService: UserService, private router: Router) { }

    newArticle = { title: '', content: '' };
    newuser: User = {
        nom: "",
        idrole: {
            _idrole: "67debb557b42f032f5ce03f9",
            role: "Client"
        },
        email: "",
        contact: "",
        adresse: "",
        password: "",
    };
    addUser(): void {
        if (this.newuser.nom && this.newuser.email && this.newuser.contact && this.newuser.adresse && this.newuser.password) {
            if (this.newuser.nom != "" && this.newuser.email != "" && this.newuser.contact != "" && this.newuser.adresse != "" && this.newuser.password != "") {
                this.userService.addUser(this.newuser).subscribe({
                    next: (response) => {
                        console.log(response);
                        this.router.navigate(['/auth/newlogin']);
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
}
