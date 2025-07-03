// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /* Base URL for all authentication-related endpoints */
  private readonly apiUrl    = 'http://localhost:8000/api/accounts';
  private readonly TOKEN_KEY = 'videoflix_token';

  constructor(private http: HttpClient) {}

  // Login & signup 

  /** Log the user in and persist the received token. */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/`, { email, password })
      .pipe(tap(res => this.saveToken(res.token)));
  }

  /** Register a new account (endpoint returns HTTP 201 with no token). */
  signup(email: string, password: string): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/signup/`, { email, password })
      .pipe(map(() => void 0));
  }

  // Email verification

  /** Confirm a signup by verification code. */
  verifyEmail(code: string): Observable<void> {
    return this.http
      .get(`${this.apiUrl}/signup/verify/`, { params: { code } })
      .pipe(map(() => void 0));
  }

  // Password-reset flow 

  /** Request a reset email. */
  requestPasswordReset(email: string): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/password/reset/`, { email })
      .pipe(map(() => void 0));
  }

  /** Check whether a reset code is valid (for deep-linked pages). */
  verifyResetCode(code: string): Observable<void> {
    return this.http
      .get(`${this.apiUrl}/password/reset/verify/`, { params: { code } })
      .pipe(map(() => void 0));
  }

  /** Final step: set a new password using the verified reset code. */
  confirmPasswordReset(code: string, newPassword: string): Observable<void> {
    return this.http
      .post(
        `${this.apiUrl}/password/reset/verified/`,
        { code, password: newPassword }
      )
      .pipe(map(() => void 0));
  }

  // Logout

  /** Invalidate the token server-side (best effort) and remove it locally. */
  logout(): Observable<void> {
    const token = this.getToken();
    if (!token) {
      localStorage.removeItem(this.TOKEN_KEY);
      return of(void 0);
    }

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
    return this.http.get(`${this.apiUrl}/logout/`, { headers }).pipe(
      tap(() => localStorage.removeItem(this.TOKEN_KEY)),
      map(() => void 0),
      catchError(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        return of(void 0);
      })
    );
  }

  // Token helpers

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    const t = localStorage.getItem(this.TOKEN_KEY);
    return t && t !== '' ? t : null;
  }

  /** Getter for template / interceptor access. */
  get token(): string | null {
    return this.getToken();
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
