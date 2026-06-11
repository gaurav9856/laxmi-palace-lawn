import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }
  ]
};
