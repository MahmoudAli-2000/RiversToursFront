import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { langInterceptor } from './core/interceptors/lang.interceptor';
import { authInterceptorInterceptor } from './core/interceptors/auth-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withInMemoryScrolling({scrollPositionRestoration: 'top'}),
      withViewTransitions()
    ), 
     provideClientHydration(),
    provideHttpClient(
      // تم إزالة withFetch() لأنها تسبب مشاكل مع Cookies في Cross-site scenarios
      // Fetch API لا يرسل Cookies بشكل موثوق مع SameSite=None و Secure=true
      withInterceptors([langInterceptor,authInterceptorInterceptor])
    ),
    provideToastr(),
     provideAnimations()
  
  ]
};
