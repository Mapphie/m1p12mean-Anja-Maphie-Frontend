import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-panels-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        SplitButtonModule,
        AccordionModule,
        FieldsetModule,
        MenuModule,
        InputTextModule,
        DividerModule,
        SplitterModule,
        PanelModule,
        TabsModule,
        IconFieldModule,
        InputIconModule
    ],
    template: `
        <div class="flex flex-col" style="max-width: 1000px; margin: 0 auto ; margin-top: 300px">
            <div class="card mt-8">
                <div class="font-semibold text-xl mb-4">Divider</div>
                <div class="flex flex-col md:flex-row">
                    <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                        <div class="flex flex-col gap-2">
                            <label for="username">Username</label>
                            <input pInputText id="username" type="text" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="password">Password</label>
                            <input pInputText id="password" type="password" />
                        </div>
                        <div class="flex">
                            <p-button label="Login" icon="pi pi-user" class="w-full max-w-[17.35rem] mx-auto"></p-button>
                        </div>
                    </div>
                    <div class="w-full md:w-2/12">
                        <p-divider layout="vertical" class="!hidden md:!flex"><b>OR</b></p-divider>
                        <p-divider layout="horizontal" class="!flex md:!hidden" align="center"><b>OR</b></p-divider>
                    </div>
                    <div class="w-full md:w-5/12 flex items-center justify-center py-5">
                        <p-button label="Sign Up" icon="pi pi-user-plus" severity="success" class="w-full" styleClass="w-full max-w-[17.35rem] mx-auto"></p-button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AuthReg {
    items: MenuItem[] = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-upload'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];
}
