import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

/**
 * Réponse de /auth/login. Le token n'y figure pas : l'API le pose dans un cookie
 * HttpOnly, envoyé automatiquement par le navigateur et illisible par JavaScript.
 */
export interface LoginResponse {
  email: string;
  userId: number;
  expiresAt: number; // expiration de la session, timestamp en secondes
}

export interface ConnectedUser {
  id: number;
  email: string;
  expiresAt: number;
  // Renseignés depuis le profil (absents de la réponse de /auth/login)
  nom?: string;
  prenom?: string;
}

// Ancienne clé où le token était stocké en clair : supprimée si elle traîne encore
const LEGACY_TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userChanged$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) { }

  login(login: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, login);
  }

  register(credentials: { email: string; password: string }) {
    return this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, credentials);
  }

  /** Enregistre la session à partir de la réponse de /auth/login (le cookie est déjà posé). */
  startSession(response: LoginResponse): void {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem('connectedUser');
    this.setConnectedUser({ id: response.userId, email: response.email, expiresAt: response.expiresAt });
  }

  /** Met à jour les informations affichées (fusionnées avec celles déjà connues). */
  setConnectedUser(utilisateur: Partial<ConnectedUser>): void {
    localStorage.setItem('connectedUser', JSON.stringify({ ...this.getConnectedUser(), ...utilisateur }));
    this.userChanged$.next();
  }

  getConnectedUser(): Partial<ConnectedUser> {
    try {
      return JSON.parse(localStorage.getItem('connectedUser') || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Session encore valide d'après son heure d'expiration. Le token lui-même n'est pas
   * lisible (cookie HttpOnly) : c'est l'API qui a le dernier mot, l'intercepteur gère ses 401.
   */
  isSessionValid(): boolean {
    const expiresAt = this.getConnectedUser().expiresAt;
    return !!expiresAt && expiresAt * 1000 > Date.now();
  }

  /**
   * Termine la session et revient à la connexion. L'appel à /auth/logout est toujours
   * fait : seul le serveur peut effacer le cookie HttpOnly (et il révoque le token s'il
   * est encore valide). Angular y joint l'en-tête CSRF (voir app.config.ts).
   */
  logout() {
    this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {})
      .subscribe({ error: () => {} });

    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem('connectedUser');
    this.userChanged$.next();
    this.router.navigate(['/auth/sign-in']);
  }

  isLoggedIn(): boolean {
    return this.isSessionValid() && !!this.getConnectedUser().email;
  }

}
