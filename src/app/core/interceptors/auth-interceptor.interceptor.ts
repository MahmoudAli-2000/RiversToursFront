import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environments';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const apiUrl = `${environment.BaseUrl}/api/`;

  // 👈 لو request طالب skip
  if (req.headers.has('X-Skip-Auth')) {
    return next(useSameOriginApiProxy(req, platformId, apiUrl));
  }

  return next(useSameOriginApiProxy(req, platformId, apiUrl)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};

function useSameOriginApiProxy(
  req: HttpRequest<unknown>,
  platformId: object,
  apiUrl: string
): HttpRequest<unknown> {
  if (isPlatformBrowser(platformId) && req.url.startsWith(apiUrl)) {
    return req.clone({ url: req.url.replace(environment.BaseUrl, '') });
  }

  return req;
}
