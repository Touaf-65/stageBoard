import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../../core/constants/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EcheanceModel {
  id: number;
  titre: string;
  description: string | null;
  date_limite: string; // AAAA-MM-JJ
  statut: 'A venir' | 'Fait' | 'En retard';
}

export interface CreateEcheanceRequest {
  title: string;
  description: string | null;
  due_date: string; // AAAA-MM-JJ
  statut: 'A venir' | 'Fait' | 'En retard';
}

@Injectable({
  providedIn: 'root',
})

export class EcheanceService {
  private echeanceBase_apiUrl = `${API_CONFIG.BASE_URL}` + `${API_CONFIG.ENDPOINTS.ECHEANCE.BASE}`
  
  constructor (private http: HttpClient) {}

  getEcheances (): Observable<EcheanceModel[]> {
    return this.http.get<EcheanceModel[]>(this.echeanceBase_apiUrl);
  }

  createEcheance (echeanceData: CreateEcheanceRequest): Observable<EcheanceModel> {
    return this.http.post<EcheanceModel>(this.echeanceBase_apiUrl, echeanceData);
  }

  updateEcheance (id: number, echeanceData: CreateEcheanceRequest): Observable<EcheanceModel> {
    return this.http.put<EcheanceModel>(`${this.echeanceBase_apiUrl}${id}`, echeanceData);
  }

  deleteEcheance (id: number): Observable<void> {
    return this.http.delete<void>(`${this.echeanceBase_apiUrl}${id}`);
  }

}
