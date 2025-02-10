import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';

export interface TypeDechetCollecte {
  type: string;
  poids: number;
}

export interface DemandeCollecte {
  id: string;
  userId: string;
  collecteurId?: string;
  dechets: TypeDechetCollecte[];
  photos: string[];
  poidsTotal: number;
  adresse: string;
  date: string;
  creneau: string;
  notes?: string;
  status: 'en_attente' | 'occupee' | 'en_cours' | 'validee' | 'rejetee';
  dateCreation: string;
  dateModification?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollecteurService {
  private apiUrl = 'http://localhost:3000/demandes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getDemandes(): Observable<DemandeCollecte[]> {
    // Récupère toutes les demandes accessibles au collecteur
    return this.http.get<DemandeCollecte[]>(this.apiUrl);
  }

  getDemandeById(id: string): Observable<DemandeCollecte> {
    return this.http.get<DemandeCollecte>(`${this.apiUrl}/${id}`);
  }

  updateDemandeStatus(id: string, status: DemandeCollecte['status']): Observable<DemandeCollecte> {
    const collecteurId = this.authService.currentUserValue?.id;
    const update = {
      status,
      collecteurId,
      dateModification: new Date().toISOString()
    };

    return this.http.patch<DemandeCollecte>(`${this.apiUrl}/${id}`, update);
  }

  // Optionnel: Récupérer les statistiques du collecteur
  getCollecteurStats(): Observable<{
    totalCollectes: number;
    poidsTotal: number;
    collectesEnCours: number;
  }> {
    const collecteurId = this.authService.currentUserValue?.id;
    return this.http.get<any>(`${this.apiUrl}/stats/${collecteurId}`);
  }
}
