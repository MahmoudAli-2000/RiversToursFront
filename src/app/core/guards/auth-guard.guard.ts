import { AuthService } from './../services/auth.service';
import {  inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      }

      // ❌ غير مسجل دخول → رجعه للـ login
      router.navigate(['/admin/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    })
  );
};

