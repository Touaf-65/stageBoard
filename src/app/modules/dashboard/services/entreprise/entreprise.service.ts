import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

export interface EntrepriseModel {
  id: number;
  nom: string;
  secteur: string | null;
  adresse: string | null;
  telephone: string | null;
  email_tuteur: string | null;
  nom_tuteur: string | null;
}

export type EntrepriseRequest = Omit<EntrepriseModel, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENTREPRISE.BASE}`;


  getEntreprise(): Observable<EntrepriseModel> {
    return this.http.get<EntrepriseModel>(
      this.apiUrl
    );
  }

  createEntreprise(data: EntrepriseRequest): Observable<{ msg: string; id: number }> {
    return this.http.post<{ msg: string; id: number }>(
      this.apiUrl,
      data
    );
  }

  updateEntreprise(id: number, data: EntrepriseRequest): Observable<{ msg: string }> {
    return this.http.put<{ msg: string }>(
      `${this.apiUrl}${id}`,
      data
    );
  }

}
