import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_CONFIG } from '../core/constants/api.config';
import { UserService } from '../modules/authentication/services/user/user.service';
import { NotificationService } from '../shared/components/notification/notification.service';
import { isAuthError } from '../shared/utils/api-error';

// Routes où un 401 signifie "identifiants/lien invalides", pas "session expirée"
const PUBLIC_AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/logout'];

/**
 * Session expirée ou token invalide (401/422) : déconnexion et retour à la connexion.
 * Le 403 n'est pas concerné : l'API l'utilise pour "ressource d'un autre utilisateur".
 *
 * Plus d'en-tête Authorization à ajouter : le token est dans un cookie HttpOnly que le
 * navigateur envoie lui-même aux appels /api (même origine). L'en-tête CSRF est ajouté
 * par Angular (withXsrfConfiguration dans app.config.ts).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_CONFIG.BASE_URL)) {
    return next(req);
  }

  const isPublic = PUBLIC_AUTH_ENDPOINTS.some(endpoint => req.url.includes(endpoint));
  const userService = inject(UserService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isPublic && isAuthError(error) && userService.getConnectedUser()?.email) {
        notificationService.warning('Session expirée', 'Veuillez vous reconnecter.');
        userService.logout();
      }
      return throwError(() => error);
    })
  );
};
