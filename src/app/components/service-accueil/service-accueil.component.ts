import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Service, ServiceService } from './../../services/service.service';


@Component({
    selector: 'app-service-accueil',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './service-accueil.component.html',
    styleUrl: './service-accueil.component.scss'
})
export class ServiceAccueilComponent implements OnInit {
    services: any[] = [];
    constructor(private serviceService: ServiceService) { }
    ngOnInit(): void {
        this.loadServices();
    }
    loadServices(): void {
        this.serviceService.getAllServices().subscribe(data => this.services =
            data);
    }

    deleteArticle(id: string): void {
        this.serviceService.deleteService(id).subscribe(() =>
            this.loadServices());
    }

}
