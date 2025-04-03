import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';




import { User, UserService } from './../../services/user.service';


@Component({
    selector: 'app-login-register',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator,
        DividerModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        MessageModule
    ],
    templateUrl: './login-register.component.html',
    styleUrl: './login-register.component.scss',
    standalone: true,
})
export class LoginRegisterComponent implements OnInit {
    users: any[] = [];
    action: string | null = "";
    constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

    datalog = { email: '', password: '' };
    errorMessage = "";


    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.action = params.get('action');
            console.log(this.action);
        });
    }


    loginregister(): void {
        if (this.datalog.email && this.datalog.password) {
            this.userService.sendtolog(this.datalog.email, this.datalog.password).subscribe({
                next: (response) => {
                    if (response.success) {
                        console.log('Connexion réussie:', response.message);
                        sessionStorage.setItem('user', JSON.stringify(response.user));
                        this.router.navigate(['/dash-client/devis']);
                    } else {
                        console.error('Erreur de connexion:', response.message);
                        this.errorMessage = response.message;
                    }
                },
                error: (err) => {
                    console.error('Erreur lors de la requête:', err);

                    if (err.status === 0) {
                        this.errorMessage = 'Impossible de se connecter au serveur. Vérifie ta connexion réseau.';
                    } else if (err.status === 401) {
                        this.errorMessage = 'Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.';
                    } else {
                        this.errorMessage = 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer plus tard.';
                    }

                    alert(this.errorMessage);
                }
            });
        } else {
            this.errorMessage = 'Veuillez entrer votre email et mot de passe.';
            alert(this.errorMessage);
        }
    }


}
