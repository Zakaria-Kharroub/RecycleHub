import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
selectedFilter: 'all' | 'en_attente' | 'validee' | 'en_cours' | 'rejetee' = 'all';
  selectedImage: string = '';
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

  nbDemandeEnAttente:number=0;

  ngOnInit() {
    this.loadDemandes();
    this.loadDemandeEnAttente();
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

  loadDemandeEnAttente(){
    this.particulierService.getDemandesEnAttente().subscribe({
      next:(nombre)=>{
        this.nbDemandeEnAttente= nombre;
      },
      error:(error)=>{
        console.log("error charge demandes en attetnte")
      }
    })
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
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Ici, nous utilisons une URL locale pour le fichier
      this.selectedImage = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this.demandeForm.valid && !this.isSubmitting && Object.keys(this.selectedTypes).length > 0) {
      if (this.nbDemandeEnAttente>=3){
        this.errorMessage = 'vous avez 3 demandes en attette';
        return;
      }
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
        photos: this.selectedImage ? [this.selectedImage] : []
      };

      this.particulierService.creerDemande(demande).subscribe({
        next: () => {
          this.demandeForm.reset();
          this.selectedTypes = {};
          this.poidsTotal = 0;
          this.selectedImage = '';
          this.loadDemandes();
          this.isSubmitting = false;
          this.loadDemandeEnAttente();
        },
        error: (error) => {
          console.error('Erreur lors de la création de la demande:', error);
          this.errorMessage = 'Une erreur est survenue lors de la création de la demande';
          this.isSubmitting = false;
        }
      });
    }
  }

  filterDemandes(status: 'all' | 'en_attente' | 'validee' | 'en_cours' | 'rejetee') {
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
          this.loadDemandeEnAttente();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  getDemandeImage(demande: DemandeRequest): string {
    return demande.photos[0] || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kSZD8xw0lrfx3HzOweQobCIG1fW3mx.png';
  }

  getStatusLabel(status: string): string{
    const statusLabels:{ [key:string]:string }={
      'en_attente':'En attente',
      'validee':'validée',
      'en_cours':'En cours',
      'rejectee':'Rejectée'
    }
    return statusLabels[status] || status;
  }

  protected readonly Object = Object;
  protected readonly status = status;
}
