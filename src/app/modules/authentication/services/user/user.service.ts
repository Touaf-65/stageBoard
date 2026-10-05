import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { API_CONFIG } from '../../../../core/constants/api.config';

export interface LoginResponse {
  token: string;
  email: string;
  userId: number;
}

export interface ConnectedUser {
  id: number;
  email: string;
  // Renseignés depuis le profil (absents de la réponse de /auth/login)
  nom?: string;
  prenom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userChanged$ = new Subject<void>();
  private jwtService = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  login(login: { email: string; password: string }) {
    return this.http.post<LoginResponse>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, login);
  }

  register(credentials: { email: string; password: string }) {
    return this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, credentials);
  }

  /** Enregistre la session à partir de la réponse de /auth/login. */
  startSession(response: LoginResponse): void {
    localStorage.setItem('authToken', response.token);
    this.setConnectedUser({ id: response.userId, email: response.email });
  }

  setConnectedUser(utilisateur: ConnectedUser): void {
    localStorage.setItem('connectedUser', JSON.stringify(utilisateur));
    this.userChanged$.next();
  }

  getConnectedUser(): Partial<ConnectedUser> {
    if (localStorage.getItem('connectedUser')) {
      return JSON.parse(localStorage.getItem('connectedUser') as string);
    }
    return {};
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem("authToken");
    try {
      return token ? !this.jwtService.isTokenExpired(token) : false;
    } catch {
      return false; // token mal formé
    }
  }

  /**
   * Termine la session locale et revient à la connexion.
   * notifyServer : invalide aussi le token côté API (POST /auth/logout). Inutile quand
   * le token est déjà refusé (session expirée), d'où logout(false) dans l'intercepteur.
   */
  logout(notifyServer = true) {
    const token = localStorage.getItem('authToken');
    if (notifyServer && token && this.isTokenValid()) {
      // En-tête passé explicitement : le token est retiré du localStorage juste après
      this.http.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
        {},
        { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      ).subscribe({ error: () => {} });
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('connectedUser');
    this.userChanged$.next();
    this.router.navigate(['/auth/sign-in']);
  }

  isLoggedIn(): boolean {
    return this.isTokenValid() && !!this.getConnectedUser().email;
  }

}
