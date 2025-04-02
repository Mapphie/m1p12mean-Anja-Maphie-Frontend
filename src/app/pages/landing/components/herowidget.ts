import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterModule } from '@angular/router';


@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, RouterModule],
    template: `
        <div
            id="hero"
            class="flex flex-col pt-3 px-6 lg:px-20 overflow-hidden"
            style="background-image: url('https://img.freepik.com/photos-premium/station-reparation-automobile-moderne-grand-nombre-ascenseurs-equipements-specialises-pour-diagnostic-service-reparation-automobile_283617-3976.jpg?ga=GA1.1.1926012545.1678351043&semt=ais_hybrid');
                background-size: cover; background-position: center; height: 100vh; /* full height */
                clip-path: ellipse(130% 70% at 93% 13%);"
        >
            <div class="absolute inset-0 bg-black opacity-40"></div> <!-- Overlay to improve text visibility -->
            <div class="mx-6 md:mx-20 mt-0 md:mt-4 relative z-10">
                <h1 class="text-5xl font-bold text-white leading-tight">
                    <span class="font-light block">m1p12mean-Maphie-Anja</span>Web Avancé
                </h1>
                <p class="font-normal text-xl leading-normal md:mt-2 text-white">Projet Final</p>
                <button pButton pRipple [rounded]="true" type="button" label="Demander un devis"
                    class="!text-lg mt-6 !px-4 mr-4" routerLink="/auth/loginregister/devis"></button>
                <button pButton pRipple [rounded]="true" type="button" label="Prendre un rendez-vous"
                    class="!text-lg mt-6 !px-4" routerLink="/auth/loginregister/rdv"></button>
            </div>
        </div>



    `
})
export class HeroWidget {
    constructor(public router: Router) { }
}
