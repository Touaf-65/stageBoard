import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../modules/authentication/user/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const userService= inject(UserService);
  const router= inject(Router);
  if(userService.isTokenValid()){
    return true;
  }else{
    router.navigate(['/auth/sign-in'])
    return false;
  }
};
