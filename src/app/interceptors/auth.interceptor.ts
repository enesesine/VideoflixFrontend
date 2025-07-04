/**
 * HTTP interceptor: hängt einen `Authorization`-Header
 * ("Token <jwt>") an **alle** Requests an – außer die URL steht
 * explizit auf der Whitelist OFFENER Endpunkte.
 *
 * Offene Endpunkte  (= ohne Auth-Header)
 * ──────────────────
 *   • /api/accounts/signup/
 *   • /api/accounts/signup/verify/          (E-Mail-Link)
 *   • /api/accounts/login/
 *   • /api/accounts/password/reset/         (Request reset mail)
 *   • /api/accounts/password/reset/verify/  (Token-Prüfung)
 *   • /api/accounts/password/reset/verified/(Neues Passwort)
 */

import { inject } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';

/**
 * Primärer Interceptor:
 *  – Prüft, ob die angeforderte URL in OPEN_ENDPOINT_PATTERNS passt.
 *  – Falls **nicht** und es existiert ein Token ⇒ Header anfügen.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth  = inject(AuthService);
  const token = auth.token; // ggf. aus LocalStorage / Signal / Subject

  /** Regex-Whitelist aller Endpunkte, die OHNE Token aufgerufen werden. */
  const OPEN_ENDPOINT_PATTERNS: RegExp[] = [
    /\/api\/accounts\/signup\/?$/,
    /\/api\/accounts\/signup\/verify\/?$/,
    /\/api\/accounts\/login\/?$/,
    /\/api\/accounts\/password\/reset\/?$/,
    /\/api\/accounts\/password\/reset\/verify\/?$/,
    /\/api\/accounts\/password\/reset\/verified\/?$/,
  ];

  // Query-String entfernen, dann gegen Whitelist prüfen
  const urlPath = req.url.split('?')[0];
  const isOpen  = OPEN_ENDPOINT_PATTERNS.some((re) => re.test(urlPath));

  if (token && !isOpen) {
    req = req.clone({
      setHeaders: { Authorization: `Token ${token}` },
    });
  }

  return next(req);
};

/** Globaler Provider, damit Angular den Interceptor registriert. */
export const authInterceptorProvider = {
  provide : HTTP_INTERCEPTORS,
  useValue: authInterceptor,
  multi   : true,
};
