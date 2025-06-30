// src/app/app.config.ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter }       from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withInterceptors
} from '@angular/common/http';

import { routes }                   from './app.routes';
import { authInterceptor }          from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router
    provideRouter(routes),

    // HttpClient mit:
    //  • allen Class-Interceptors aus DI (falls noch welche hättest)
    //  • plus Deinem Function-Interceptor authInterceptor
    provideHttpClient(
    withInterceptors([ authInterceptor ]),
    withInterceptorsFromDi()
),
  ]
};
