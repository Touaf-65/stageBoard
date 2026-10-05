import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

export interface ProfileModel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  annee: string;
  type_stage: string;
  date_debut: string;
  date_fin: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  constructor(private http: HttpClient) {}


  getProfile(): Observable<ProfileModel> {
    return this.http.get<ProfileModel>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.BASE}`
    );
  }

  // L'API renvoie { msg, profile } : on ne garde que le profil mis à jour
  updateProfile(data: Partial<ProfileModel>): Observable<ProfileModel> {
    return this.http.put<{ msg: string; profile: ProfileModel }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.BASE}`,
      data
    ).pipe(map(response => response.profile));
  }

  isProfileComplete(profile: ProfileModel | null): boolean {
    if (!profile) return false;
    return !!(
      profile.nom &&
      profile.prenom &&
      profile.email &&
      profile.filiere &&
      profile.annee &&
      profile.type_stage &&
      profile.date_debut &&
      profile.date_fin
    );
  }
}