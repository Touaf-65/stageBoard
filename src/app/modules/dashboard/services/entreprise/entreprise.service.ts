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

  constructor(private http: HttpClient) { }

  private apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENTREPRISE.BASE}`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getEntreprise(): Observable<EntrepriseModel> {

    return this.http.get<EntrepriseModel>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

}