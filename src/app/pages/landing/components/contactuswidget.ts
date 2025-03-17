import { Component } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';


@Component({
    selector: 'contactus-widget',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule],
    template: `<p-fluid>
         <div id="contactus" class="flex mt-8" style="max-width: 1500px; margin: 0 auto">
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Contactez-nous</div>
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="nom">Nom</label>
                        <input pInputText id="nom" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="prenom">Prénom</label>
                        <input pInputText id="prenom" type="text" />
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="email">adresse email</label>
                        <input pInputText id="email" type="text" />
                    </div>
                </div>
                <div class="flex flex-wrap">
                    <label for="message">Message</label>
                    <textarea pTextarea id="message" rows="4"></textarea>
                </div>
                    <p-button label="Envoyer" />


                
            </div>
        </div>
    </p-fluid>`
})
export class ContactUsWidget {
    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    dropdownItem = null;
}
