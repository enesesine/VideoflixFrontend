/**
 * HTTP interceptor that appends an `Authorization` header
 * (`Token <jwt-token>`) to every outgoing request—except for
 * explicitly whitelisted public endpoints (signup, login,
 * password-reset flows).
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
 * Primary interceptor implementation.
 *  - Skips adding the header if the request URL matches one of the
 *    open endpoints or if no token is present.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth  = inject(AuthService);
  const token = auth.token;

  /** Public endpoints that must remain header-free. */
  const OPEN_ENDPOINT_PATTERNS: RegExp[] = [
    /\/api\/accounts\/signup\/?$/,
    /\/api\/accounts\/signup\/verify\/?$/,
    /\/api\/accounts\/login\/?$/,
    /\/api\/accounts\/password\/reset\/?$/,
    /\/api\/accounts\/password\/reset\/verify\/?$/,
    /\/api\/accounts\/password\/reset\/verified\/?$/,
  ];

  /* Check the path (query string stripped) against the whitelist. */
  const urlPath = req.url.split('?')[0];
  const isOpen  = OPEN_ENDPOINT_PATTERNS.some(re => re.test(urlPath));

  if (token && !isOpen) {
    req = req.clone({
      setHeaders: { Authorization: `Token ${token}` },
    });
  }

  return next(req);
};

/** Register the interceptor application-wide. */
export const authInterceptorProvider = {
  provide : HTTP_INTERCEPTORS,
  useValue: authInterceptor,
  multi   : true,
};
