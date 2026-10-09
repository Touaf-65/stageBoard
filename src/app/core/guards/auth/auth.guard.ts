import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../../modules/authentication/services/user/user.service';
import { inject } from '@angular/core';

/**
 * Accès réservé aux utilisateurs connectés dont la session n'a pas expiré.
 * Vérifié côté client (heure d'expiration renvoyée à la connexion) avant tout appel
 * à l'API ; l'intercepteur couvre le cas d'un token refusé par le serveur.
 */
export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSessionValid()) {
    return true;
  }

  // Session expirée encore connue localement : on la termine (cookie effacé côté serveur).
  // Redirection par UrlTree plutôt que router.navigate : lancer une navigation pendant
  // une autre peut l'annuler et laisser la page blanche.
  if (userService.getConnectedUser().email) {
    userService.endSession();
  }
  return router.createUrlTree(['/auth/sign-in']);
};
