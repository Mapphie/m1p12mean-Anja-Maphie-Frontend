import { Component } from '@angular/core';

@Component({
    selector: 'highlights-widget',
    template: `
        <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">A propos de notre Site</div>
            </div>

            <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                    <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-desktop !text-3xl text-yellow-700"></i>
                    </div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px"
                        >Bienvenue sur notre site, votre partenaire de confiance pour l’entretien
                        et la réparation de votre véhicule. Il vous permet de découvrir nos services,
                         de prendre rendez-vous en ligne et d’accéder à des conseils pour prolonger la durée
                          de vie de votre voiture. Que ce soit pour une vidange, un diagnostic électronique
                           ou une réparation mécanique, notre équipe d’experts est à votre disposition pour
                            vous garantir sécurité et performance.
                         Naviguez dès maintenant et profitez de notre expertise pour rouler en toute sérénité !</span
                    >
                </div>

                <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0" style="border-radius: 8px">
                    <img src="https://primefaces.org/cdn/templates/sakai/landing/mockup-desktop.png" class="w-11/12" alt="mockup" />
                </div>
            </div>
        </div>
    `
})
export class HighlightsWidget { }
