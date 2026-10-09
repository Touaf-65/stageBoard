import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authInterceptor } from './interceptor/interceptor';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      // Protection CSRF de l'API (token en cookie) : Angular lit le cookie csrf_access_token
      // et le renvoie dans l'en-tête X-CSRF-TOKEN des requêtes POST/PUT/DELETE vers /api
      withXsrfConfiguration({ cookieName: 'csrf_access_token', headerName: 'X-CSRF-TOKEN' }),
    ),
    provideAngularSvgIcon(),
    provideAnimations(),
    // Format unique des dates affichées (JJ/MM/AA) : utiliser `| date` sans argument
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'dd/MM/yy' } },

    importProvidersFrom(FontAwesomeModule)
  ]
};