import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EcheanceModel {
  id: number;
  titre: string;
  description: string;
  date_limite: Date;
  statut: 'A venir' | 'Fait' | 'En retard';
}

export interface CreateEcheanceRequest {
  title: string;
  description: string;
  due_date: Date;
  statut: 'A venir' | 'Fait' | 'En retard';
}

@Injectable({
  providedIn: 'root',
})

export class EcheanceService {
  private echeanceBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.ECHEANCE.BASE}`
  
  constructor (private http: HttpClient) {}

    private getAuthHeaders(): HttpHeaders{
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return headers;
  }

  getEcheances (): Observable<EcheanceModel[]> {
    return this.http.get<EcheanceModel[]>(this.echeanceBase_apiUrl, { headers: this.getAuthHeaders() });
  }

  createEcheance (echeanceData: CreateEcheanceRequest): Observable<EcheanceModel> {
    return this.http.post<EcheanceModel>(this.echeanceBase_apiUrl, echeanceData, { headers: this.getAuthHeaders() });
  }

  updateEcheance (id: number, echeanceData: CreateEcheanceRequest): Observable<EcheanceModel> {
    return this.http.put<EcheanceModel>(`${this.echeanceBase_apiUrl}${id}`, echeanceData, { headers: this.getAuthHeaders() });
  }

  deleteEcheance (id: number): Observable<void> {
    return this.http.delete<void>(`${this.echeanceBase_apiUrl}${id}`, { headers: this.getAuthHeaders() });
  }

}
