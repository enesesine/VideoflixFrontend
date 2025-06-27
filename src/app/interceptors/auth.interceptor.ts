// src/app/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';

/**
 * Fügt – falls vorhanden – den `Authorization`-Header hinzu,
 * jedoch NIE bei den „open endpoints“ (Registrierung, Login,
 * Aktivierung, Passwort-Reset …).
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth  = inject(AuthService);
  const token = auth.token;          // Kurz-Getter aus dem Service

  /* ─────────────────────────────────────────────────────────────
     Offene Endpunkte als RegExp (Slash am Ende optional)
     ──────────────────────────────────────────────────────────── */
  const OPEN_ENDPOINT_PATTERNS: RegExp[] = [
    /\/api\/auth\/users\/?$/,                       // Registrierung
    /\/api\/auth\/users\/activation\/?$/,           // Aktivierung

    /\/api\/auth\/login\/?$/,                       // eigene Login-Route
    /\/api\/auth\/token\/login\/?$/,                // Djoser token-login

    /\/api\/auth\/users\/reset_password\/?$/,           // Reset-Request
    /\/api\/auth\/users\/reset_password_confirm\/?$/,   // Reset-Confirm

    /\/api\/auth\/token\/logout\/?$/,               // Djoser token-logout
  ];

  // Nur den Pfad (ohne Query-String) vergleichen
  const urlPath = req.url.split('?')[0];
  const isOpen  = OPEN_ENDPOINT_PATTERNS.some((re) => re.test(urlPath));

  /* ─────────────────────────────────────────────────────────────
     Header nur anhängen, wenn wir NICHT auf einem Open-Endpoint sind
     ──────────────────────────────────────────────────────────── */
  if (token && !isOpen) {
    req = req.clone({
      setHeaders: { Authorization: `Token ${token}` },
    });
  }

  return next(req);
};

/* Provider – global registrieren (z. B. in `app.config.ts`) */
export const authInterceptorProvider = {
  provide : HTTP_INTERCEPTORS,
  useValue: authInterceptor,
  multi   : true,
};
