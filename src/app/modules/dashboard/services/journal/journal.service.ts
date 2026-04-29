import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

export interface JournalModel {
  id: number;
  titre: string;
  description: string;
  date_entree: Date;
  competences: string;
  difficultes: string;
  taches: string;
}

export interface CreateJournalRequest {
  titre: string;
  description: string;
  date_entree: Date;
  competences: string;
  difficultes: string;
  taches: string;
}

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOURNAL.BASE}`;
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
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

  getJournals(): Observable<JournalModel[]> {
    return this.http.get<JournalModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createJournal(journalData: CreateJournalRequest): Observable<JournalModel> {
    return this.http.post<JournalModel>(this.apiUrl, journalData, { headers: this.getAuthHeaders() });
  }

  updateJournal(id: number, journalData: CreateJournalRequest): Observable<JournalModel> {
    return this.http.put<JournalModel>(`${this.apiUrl}${id}`, journalData, { headers: this.getAuthHeaders() });
  }

  deleteJournal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`, { headers: this.getAuthHeaders() });
  }
}
