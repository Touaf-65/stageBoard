import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../../modules/authentication/services/user/user.service';
import { inject } from '@angular/core';

/**
 * Accès réservé aux utilisateurs connectés avec un token non expiré.
 * Vérifié côté client (date d'expiration du JWT) avant tout appel à l'API ;
 * l'intercepteur couvre le cas d'un token refusé par le serveur.
 */
export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isTokenValid()) {
    return true;
  }

  // Token expiré encore présent : on nettoie la session locale
  if (localStorage.getItem('authToken')) {
    userService.logout(false);
    return false;
  }
  return router.createUrlTree(['/auth/sign-in']);
};
