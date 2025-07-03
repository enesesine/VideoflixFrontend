// src/app/app.config.ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withInterceptors,
} from '@angular/common/http';

import { routes }          from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router setup
    provideRouter(routes),

    // HttpClient with:
    // • function-style interceptor (authInterceptor)
    // • plus any class-based interceptors registered via DI
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi(),
    ),
  ],
};
