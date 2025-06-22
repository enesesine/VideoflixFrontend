import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HTTP_INTERCEPTORS,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  // hier entweder auth.token (wenn du den Getter definiert hast)
  // oder auth.getToken()
  const token = auth.token;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }
  return next(req);
};

// Provider für provideHttpClient
export const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useValue: authInterceptor,
  multi: true
};
