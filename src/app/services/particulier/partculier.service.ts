import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';

export interface TypeDechetPoids {
  type: string;
  poids: number;
}

export interface DemandeRequest {
  id?: string;
  userId: string;
  dechets: TypeDechetPoids[];
  photos: string[];
  poidsTotal: number;
  adresse: string;
  date: string;
  creneau: string;
  notes?: string;
  status: 'en_attente' | 'validee';
  dateCreation: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticulierService {
  private apiUrl = 'http://localhost:3000/demandes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  creerDemande(demande: Omit<DemandeRequest, 'id' | 'userId' | 'status' | 'dateCreation'>): Observable<DemandeRequest> {
    const userId = this.authService.useId;
    const demandeComplete: Omit<DemandeRequest, 'id'> = {
      ...demande,
      userId,
      status: 'en_attente',
      dateCreation: new Date().toISOString()
    };

    return this.http.post<DemandeRequest>(this.apiUrl, demandeComplete);
  }

  getDemandes(): Observable<DemandeRequest[]> {
    const userId = this.authService.useId;
    return this.http.get<DemandeRequest[]>(`${this.apiUrl}?userId=${userId}`);
  }
  getDemandesEnAttente():Observable<number>{
    const userId= this.authService.useId;
    return this.http.get<DemandeRequest[]>(`${this.apiUrl}?userId=${userId}&status=en_attente`)
      .pipe(
        map(demades =>demades.length)
      );
  }

  supprimerDemande(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
