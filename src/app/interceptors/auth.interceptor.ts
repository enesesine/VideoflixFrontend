import { inject } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';

/**
 * Hängt – falls vorhanden – den `Authorization`-Header an,
 * aber NIE bei offenen Endpunkten (Signup, Login, Reset …).
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth  = inject(AuthService);
  const token = auth.token;

  /* Offene Endpunkte (Slash am Ende optional) */
  const OPEN_ENDPOINT_PATTERNS: RegExp[] = [
    /\/api\/accounts\/signup\/?$/,
    /\/api\/accounts\/signup\/verify\/?$/,
    /\/api\/accounts\/login\/?$/,
    /\/api\/accounts\/password\/reset\/?$/,
    /\/api\/accounts\/password\/reset\/verify\/?$/,
    /\/api\/accounts\/password\/reset\/verified\/?$/,
  ];

  /* Pfad ohne Query-String prüfen */
  const urlPath = req.url.split('?')[0];
  const isOpen  = OPEN_ENDPOINT_PATTERNS.some(re => re.test(urlPath));

  if (token && !isOpen) {
    req = req.clone({
      setHeaders: { Authorization: `Token ${token}` },
    });
  }

  return next(req);
};

/* Provider global registrieren */
export const authInterceptorProvider = {
  provide : HTTP_INTERCEPTORS,
  useValue: authInterceptor,
  multi   : true,
};
