import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

export interface JournalModel {
  id: number;
  titre: string;
  description: string | null;
  date_entree: string; // AAAA-MM-JJ
  competences: string;
  difficultes: string;
  taches: string;
}

export interface CreateJournalRequest {
  titre: string;
  description: string | null;
  date_entree: string; // AAAA-MM-JJ
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

  getJournals(): Observable<JournalModel[]> {
    return this.http.get<JournalModel[]>(this.apiUrl);
  }

  createJournal(journalData: CreateJournalRequest): Observable<JournalModel> {
    return this.http.post<JournalModel>(this.apiUrl, journalData);
  }

  updateJournal(id: number, journalData: CreateJournalRequest): Observable<JournalModel> {
    return this.http.put<JournalModel>(`${this.apiUrl}${id}`, journalData);
  }

  deleteJournal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
