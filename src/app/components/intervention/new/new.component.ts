import { Service, ServiceService } from './../../../services/service.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterventionService } from '../../../services/intervention.service';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { Client,ClientsService } from '../../../services/clients.service';
import { UserService } from './../../../services/user.service';
import { ClientVehiculeService } from './../../../services/client-vehicule.service';

@Component({
  selector: 'app-new-intervention',
  imports: [CommonModule, FormsModule,ButtonModule,ConfirmDialogModule,DialogModule,CalendarModule,InputTextModule,DropdownModule,ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewInterventionComponent implements OnInit {
  @Input() interventionId?: number
  @Output() close = new EventEmitter<void>()

  interventionForm: FormGroup
  isEditMode = false
  formTitle = "Nouvel Intervention"
  statuses = ["En cours", "Fini", "En attente"];

  clients : Client[] = []
  vehicules = ["Renault Clio", "Peugeot 208", "Citroën C3"]
  services : Service[] = []
  mecaniciens = ["Pierre Martin", "Jean Dupont", "Marie Durand"]

  constructor(
    private fb: FormBuilder,
    private interventionService: InterventionService,
    private clientService: ClientsService,
    private vehiculeService: ClientVehiculeService,
    private serviceService: ServiceService,
    private userService: UserService,
  ) {
    this.interventionForm = this.createForm()
  }

  ngOnInit(): void {

    if (this.interventionId) {
      this.isEditMode = true
      this.formTitle = "Modifier Intervention"
      this.loadIntervention(this.interventionId)

    }

    this.loadClient()
    this.loadService()
  }

  createForm(): FormGroup {
    return this.fb.group({
      client: ["", Validators.required],
      vehicule: ["", Validators.required],
      service: ["", Validators.required],
      mecanicien: ["", Validators.required],
      dateDemande: ["", Validators.required],
      dateDebut: ["", Validators.required],
      dureeEstimee: ["", Validators.required],
      dateFin: [""],
      coutEstime: [0, [Validators.required, Validators.min(0)]],
      status: ["En cours", Validators.required],
    })
  }

  loadIntervention(id: number): void {
    this.interventionService.getInterventionById(id).subscribe((intervention) => {
      if (intervention) {
        // Convertir les dates en format string pour les inputs date
        const formattedIntervention = {
          ...intervention,
          dateDemande: this.formatDateForInput(intervention.dateDemande),
          dateDebut: this.formatDateForInput(intervention.dateDebut),
          dateFin: intervention.dateFin ? this.formatDateForInput(intervention.dateFin) : "",
        }

        this.interventionForm.patchValue(formattedIntervention)
      }
    })
  }

  loadClient(): void{
    this.clientService.getClients().subscribe((clients) => {
        this.clients = clients
    })
  }

  loadService(): void{
    this.serviceService.getAllServices().subscribe((services) => {
        this.services = services
    })
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date)
    let month = "" + (d.getMonth() + 1)
    let day = "" + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day

    return [year, month, day].join("-")
  }

  onSubmit(): void {
    if (this.interventionForm.valid) {
      const formValue = this.interventionForm.value

      // Convertir les strings de date en objets Date
      const intervention = {
        ...formValue,
        dateDemande: new Date(formValue.dateDemande),
        dateDebut: new Date(formValue.dateDebut),
        dateFin: formValue.dateFin ? new Date(formValue.dateFin) : null,
      }

      if (this.isEditMode && this.interventionId) {
        this.interventionService.updateIntervention(this.interventionId, intervention).subscribe(() => {
          this.close.emit()
        })
      } else {
        this.interventionService.addIntervention(intervention).subscribe(() => {
          this.close.emit()
        })
      }
    }
  }

  onCancel(): void {
    this.close.emit()
  }
}

