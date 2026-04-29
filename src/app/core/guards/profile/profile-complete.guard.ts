import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileService } from '../../../modules/dashboard/services/profile/profile.service';
import { EntrepriseService } from '../../../modules/dashboard/services/entreprise/entreprise.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileCompleteGuard implements CanActivate {

  constructor(
    private profileService: ProfileService,
    private entrepriseService: EntrepriseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return forkJoin({
      profile: this.profileService.getProfile().pipe(catchError(() => of(null))),
      entreprise: this.entrepriseService.getEntreprise().pipe(catchError(() => of(null)))
    }).pipe(
      map(({ profile, entreprise }) => {
        const profileOk = this.profileService.isProfileComplete(profile);
        const entrepriseOk = !!(entreprise?.id);

        if (!profileOk || !entrepriseOk) {
          this.router.navigate(['/dashboard/profile'], {
            queryParams: {
              incomplete: true,
              missingProfile: !profileOk,
              missingEntreprise: !entrepriseOk
            }
          });
          return false;
        }
        return true;
      })
    );
  }
}