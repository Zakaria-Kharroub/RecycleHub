import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import {AuthService} from '../auth.service';

interface Dechet {
  type: string;
  poids: number;
}

interface DemandeCollecte {
  id: string;
  status: string;
  dechets: Dechet[];
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserProfile(): Observable<any> {
    const userId = this.authService.useId;
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    const userId = this.authService.useId;
    return this.http.patch(`${this.apiUrl}/users/${userId}`, profileData);
  }

  getValidatedDemandes(): Observable<DemandeCollecte[]> {
    const userId = this.authService.useId;
    return this.http.get<DemandeCollecte[]>(`${this.apiUrl}/demandes?userId=${userId}&status=validee`);
  }

  calculateAndUpdatePoints(): Observable<any> {
    return this.getValidatedDemandes().pipe(
      map(demandes => this.calculateTotalPoints(demandes)),
      switchMap(points => this.updateUserPoints(points)),
      catchError(error => {
        console.error('Error calculating points:', error);
        return of({ points: 0 });
      })
    );
  }

  private calculateTotalPoints(demandes: DemandeCollecte[]): number {
    return demandes.reduce((total, demande) => {
      return total + this.calculatePointsForDemande(demande);
    }, 0);
  }

  private calculatePointsForDemande(demande: DemandeCollecte): number {
    const pointsPerKg = {
      plastique: 2,
      verre: 1,
      papier: 1,
      metal: 5
    };

    return demande.dechets.reduce((total, dechet) => {
      const poidsEnKg = dechet.poids / 1000; // Conversion de grammes en kg
      return total + (pointsPerKg[dechet.type as keyof typeof pointsPerKg] || 0) * poidsEnKg;
    }, 0);
  }

  private updateUserPoints(points: number): Observable<any> {
    const userId = this.authService.useId;
    return this.http.get(`${this.apiUrl}/users/${userId}`).pipe(
      switchMap(user => {
        const updatedPoints = (user as any).points ? (user as any).points + points : points;
        return this.http.patch(`${this.apiUrl}/users/${userId}`, { points: updatedPoints });
      })
    );
  }

  convertPoints(amount: number): Observable<any> {
    const userId = this.authService.useId;
    return this.getUserProfile().pipe(
      switchMap(user => {
        if (user.points < amount) {
          throw new Error('Pas assez de points');
        }
        return this.http.patch(`${this.apiUrl}/users/${userId}`, { points: user.points - amount });
      })
    );
  }
}
