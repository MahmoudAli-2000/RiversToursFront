import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const logedGuard: CanActivateFn = (route, state) => { const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(isAuth => {
      if (isAuth) {
        // لو المستخدم مسجل دخول → رجعه للـ dashboard
        router.navigate(['/admin/tours']);
        return false; // ممنوع الوصول للصفحة
      }
      return true; // مش مسجل دخول → يسمح له بالوصول
    }),
    // لو فيه error اعتبره مش مسجل دخول
    catchError(() => of(true))
  );
};
