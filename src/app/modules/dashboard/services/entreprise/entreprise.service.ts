import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { Entreprise } from '../../pages/entreprise/entreprise';

export interface EntrepriseModel {
  id: number;
  nom: string;
  secteur: string;
  adresse: string;
  telephone: string;
  email_tuteur: string;
  nom_tuteur: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getEntreprise1(): Observable<EntrepriseModel> {
    return this.http.get<EntrepriseModel>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENTREPRISE.GET}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Erreur chargement entreprise:', err);
        return of({} as EntrepriseModel);
      })
    );
  }

  getEntreprise(): Observable<EntrepriseModel> {
  const token = localStorage.getItem('authToken');
  
  return this.http.get<EntrepriseModel>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENTREPRISE.GET}`,
    { headers: this.getAuthHeaders() }
  ).pipe(
    catchError(err => {
      return of({} as EntrepriseModel);
    })
  );
}


}