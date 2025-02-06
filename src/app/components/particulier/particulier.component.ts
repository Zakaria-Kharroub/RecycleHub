import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../layouts/header/header.component';
import {DemandeRequest, ParticulierService} from '../../services/particulier/partculier.service';

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

  constructor(
    private fb: FormBuilder,
    private particulierService: ParticulierService
  ) {
    this.demandeForm = this.fb.group({
      typesDechets: [[], [Validators.required, Validators.minLength(1)]],
      poids: ['', [Validators.required, Validators.min(1000)]],
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

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  toggleTypeDechet(type: string) {
    const currentTypes = this.demandeForm.get('typesDechets')?.value as string[];
    const index = currentTypes.indexOf(type);

    if (index === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(index, 1);
    }

    this.demandeForm.patchValue({ typesDechets: currentTypes });
  }

  onSubmit() {
    if (this.demandeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // TODO: Gérer l'upload des fichiers vers le serveur
      const demande = {
        ...this.demandeForm.value,
        photos: [] // Ajouter les URLs des photos après l'upload
      };

      this.particulierService.creerDemande(demande).subscribe({
        next: () => {
          this.demandeForm.reset();
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

  filterDemandes(status: 'all' | 'en_attente' | 'validee') {
    this.selectedFilter = status;
  }

  get filteredDemandes() {
    if (this.selectedFilter === 'all') {
      return this.demandes;
    }
    return this.demandes.filter(demande => demande.status === this.selectedFilter);
  }

  isTypeDechetSelected(type: string): boolean {
    return (this.demandeForm.get('typesDechets')?.value as string[]).includes(type);
  }
}
