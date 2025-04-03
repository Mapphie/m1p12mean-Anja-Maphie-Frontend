import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Client, ClientsService } from '../../../services/clients.service';
import { RendezVousComponent } from '../../rendez-vous/rendez-vous.component';

@Component({
  selector: 'app-details',
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
      InputIconModule,
      MenubarModule,
      RendezVousComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsClientComponent {
showStatClient: boolean = true;
    showCarList: boolean = false;
    showRv: boolean = false;
    clientNumber: string = '';
    client: Client | undefined;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private clientService: ClientsService,
    ) {}

    ngOnInit() :void{
        this.clientNumber = this.route.snapshot.paramMap.get('id')!;
        this.clientService.getClientById(this.clientNumber).subscribe(client => {
            this.client = client
        })
    }

    nestedMenuItems = [
        {
            label: 'Véhicule',
            icon: 'pi pi-fw pi-car',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },

            ]
        },
        {
            label: 'Rendez-vous',
            icon: 'pi pi-fw pi-calendar-clock',
            command: ()=>{
                this.showStatClient = false;
                this.showRv = true;
            }
        },
        {
            label: 'Devis',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },
            ]
        },
        {
            label: 'Facture',
            icon: 'pi pi-fw pi-receipt',
            items: [
                {
                    label: 'Liste',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Nouveau',
                    icon: 'pi pi-fw pi-plus'
                },
            ]
        },
        {
            label: 'Retour',
            icon: 'pi pi-fw pi-arrow-circle-left',
            command: ()=>{
                this.router.navigate(['/clients']);
            }
        }
    ];
}
