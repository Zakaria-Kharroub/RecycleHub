import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layouts/header/header.component';
import {CollecteurService, DemandeCollecte} from '../../services/collecteur/collecteur.service';

type StatusFilter = 'all' | 'en_attente' | 'occupee' | 'en_cours' | 'validee' | 'rejetee';

@Component({
  selector: 'app-collecteur',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './collecteur.component.html',
  styleUrls: ['./collecteur.component.css']
})
export class CollecteurComponent implements OnInit {
  demandes: DemandeCollecte[] = [];
  selectedFilter: StatusFilter = 'all';

  constructor(private collecteurService: CollecteurService) {}

  ngOnInit() {
    this.loadDemandes();
  }

  loadDemandes() {
    this.collecteurService.getDemandes().subscribe({
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

  filterDemandes(status: StatusFilter) {
    this.selectedFilter = status;
  }

  get filteredDemandes() {
    if (this.selectedFilter === 'all') {
      return this.demandes;
    }
    return this.demandes.filter(demande => demande.status === this.selectedFilter);
  }

  getDemandeImage(demande: DemandeCollecte): string {
    return demande.photos[0] || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kSZD8xw0lrfx3HzOweQobCIG1fW3mx.png';
  }

  getDechetIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'plastique': 'fa-wine-bottle',
      'verre': 'fa-glass-martini',
      'papier': 'fa-newspaper',
      'metal': 'fa-cube'
    };
    return icons[type] || 'fa-recycle';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'en_attente': 'En attente',
      'occupee': 'Occupée',
      'en_cours': 'En cours',
      'validee': 'Validée',
      'rejetee': 'Rejetée'
    };
    return labels[status] || status;
  }

  accepterDemande(id: string) {
    if (confirm('Voulez-vous accepter cette demande de collecte ?')) {
      this.collecteurService.updateDemandeStatus(id, 'occupee').subscribe({
        next: () => {
          this.loadDemandes();
        },
        error: (error) => {
          console.error('Erreur lors de l\'acceptation de la demande:', error);
        }
      });
    }
  }

  rejeterDemande(id: string) {
    if (confirm('Voulez-vous rejeter cette demande de collecte ?')) {
      this.collecteurService.updateDemandeStatus(id, 'rejetee').subscribe({
        next: () => {
          this.loadDemandes();
        },
        error: (error) => {
          console.error('Erreur lors du rejet de la demande:', error);
        }
      });
    }
  }

  commencerCollecte(id: string) {
    if (confirm('Voulez-vous commencer cette collecte ?')) {
      this.collecteurService.updateDemandeStatus(id, 'en_cours').subscribe({
        next: () => {
          this.loadDemandes();
        },
        error: (error) => {
          console.error('Erreur lors du démarrage de la collecte:', error);
        }
      });
    }
  }

  terminerCollecte(id: string) {
    if (confirm('Voulez-vous terminer cette collecte ?')) {
      this.collecteurService.updateDemandeStatus(id, 'validee').subscribe({
        next: () => {
          this.loadDemandes();
        },
        error: (error) => {
          console.error('Erreur lors de la validation de la collecte:', error);
        }
      });
    }
  }
}
