import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ProfileService } from '../../../modules/dashboard/services/profile/profile.service';
import { EntrepriseService } from '../../../modules/dashboard/services/entreprise/entreprise.service';
import { UserService } from '../../../modules/authentication/services/user/user.service';
import { isAuthError } from '../../../shared/utils/api-error';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Result<T> {
  data: T | null;
  error: HttpErrorResponse | null;
}

// Garde la réponse ou l'erreur, pour distinguer "absent" (404) d'une session expirée
function settle<T>(request: Observable<T>): Observable<Result<T>> {
  return request.pipe(
    map(data => ({ data, error: null })),
    catchError((error: HttpErrorResponse) => of({ data: null, error }))
  );
}

@Injectable({ providedIn: 'root' })
export class ProfileCompleteGuard implements CanActivate {

  constructor(
    private profileService: ProfileService,
    private entrepriseService: EntrepriseService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return forkJoin({
      profile: settle(this.profileService.getProfile()),
      entreprise: settle(this.entrepriseService.getEntreprise())
    }).pipe(
      map(({ profile, entreprise }) => {
        // Session expirée ou token invalide : retour à la connexion
        if (isAuthError(profile.error) || isAuthError(entreprise.error)) {
          this.userService.logout();
          return false;
        }

        // Erreur serveur ou réseau : on ne conclut pas à un profil incomplet,
        // la page affichera elle-même l'erreur de chargement
        if (profile.error || (entreprise.error && entreprise.error.status !== 404)) {
          return true;
        }

        const profileOk = this.profileService.isProfileComplete(profile.data);
        const entrepriseOk = !!entreprise.data?.id;

        if (!profileOk || !entrepriseOk) {
          return this.router.createUrlTree(['/dashboard/profile'], {
            queryParams: { incomplete: true }
          });
        }
        return true;
      })
    );
  }
}
