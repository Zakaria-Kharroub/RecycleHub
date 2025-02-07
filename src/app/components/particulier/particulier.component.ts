import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../layouts/header/header.component';
import {DemandeRequest, ParticulierService} from '../../services/particulier/partculier.service';

interface TypeDechet {
  id: string;
  nom: string;
  icon: string;
}

@Component({
  selector: 'app-particulier',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './particulier.component.html',
  styleUrls: ['./particulier.component.css']
})
export class ParticulierComponent implements OnInit {
  demandeForm: FormGroup;
  demandes: DemandeRequest[] = [];
  isSubmitting = false;
  errorMessage = '';
  selectedFilter: 'all' | 'en_attente' | 'validee' = 'all';
  selectedFiles: File[] = [];
  poidsTotal = 0;

  typesDechets: TypeDechet[] = [
    { id: 'plastique', nom: 'Plastique', icon: 'fa-wine-bottle' },
    { id: 'verre', nom: 'Verre', icon: 'fa-glass-martini' },
    { id: 'papier', nom: 'Papier', icon: 'fa-newspaper' },
    { id: 'metal', nom: 'Métal', icon: 'fa-cube' }
  ];

  selectedTypes: { [key: string]: number } = {};

  constructor(
    private fb: FormBuilder,
    private particulierService: ParticulierService
  ) {
    this.demandeForm = this.fb.group({
      adresse: ['', Validators.required],
      date: ['', Validators.required],
      creneau: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadDemandes();
  }

  loadDemandes() {
    this.particulierService.getDemandes().subscribe({
      next: (demandes) => {
        this.demandes = demandes.sort((a, b) =>
          new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
        );
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
      }
    });
  }

  toggleTypeDechet(typeId: string) {
    if (this.selectedTypes[typeId] !== undefined) {
      delete this.selectedTypes[typeId];
    } else {
      this.selectedTypes[typeId] = 0;
    }
    this.updatePoidsTotal();
  }

  isTypeDechetSelected(typeId: string): boolean {
    return this.selectedTypes[typeId] !== undefined;
  }

  updatePoids(typeId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedTypes[typeId] = parseInt(input.value) || 0;
    this.updatePoidsTotal();
  }

  updatePoidsTotal() {
    this.poidsTotal = Object.values(this.selectedTypes).reduce((total, poids) => total + poids, 0);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit() {
    if (this.demandeForm.valid && !this.isSubmitting && Object.keys(this.selectedTypes).length > 0) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const dechets = Object.entries(this.selectedTypes).map(([type, poids]) => ({
        type,
        poids
      }));

      const demande = {
        ...this.demandeForm.value,
        dechets,
        poidsTotal: this.poidsTotal,
        photos: []
      };

      this.particulierService.creerDemande(demande).subscribe({
        next: () => {
          this.demandeForm.reset();
          this.selectedTypes = {};
          this.poidsTotal = 0;
          this.selectedFiles = [];
          this.loadDemandes();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création de la demande:', error);
          this.errorMessage = 'Une erreur est survenue lors de la création de la demande';
          this.isSubmitting = false;
        }
      });
    }
  }

  filterDemandes(status: 'all' | 'en_attente' | 'validee') {
    this.selectedFilter = status;
  }

  get filteredDemandes() {
    if (this.selectedFilter === 'all') {
      return this.demandes;
    }
    return this.demandes.filter(demande => demande.status === this.selectedFilter);
  }

  supprimerDemande(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.particulierService.supprimerDemande(id).subscribe({
        next: () => {
          this.loadDemandes();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  protected readonly Object = Object;
}
