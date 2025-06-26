// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl    = 'http://localhost:8000/api/auth';
  private readonly TOKEN_KEY = 'videoflix_token';

  constructor(private http: HttpClient) {}

  /* ────────── LOGIN / REGISTER ────────── */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/`, { email, password })
      .pipe(tap(res => this.saveToken(res.token)));
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register/`, { email, password })
      .pipe(tap(res => this.saveToken(res.token)));
  }

  /* ────────── PASSWORT-RESET ────────── */
  /** Lost/Forgot-Password – Reset-Link anfordern */
  requestPasswordReset(email: string): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/forgot-password/`, { email })
      .pipe(map(() => void 0));
  }

  /* ────────── LOGOUT ────────── */
  /**
   * Meldet den Benutzer server- & clientseitig ab.
   * Gibt immer `Observable<void>` zurück.
   */
  logout(): Observable<void> {
    const token = this.getToken();
    if (!token) {
      localStorage.removeItem(this.TOKEN_KEY);
      return of(void 0);
    }

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    return this.http.post(`${this.apiUrl}/logout/`, {}, { headers }).pipe(
      tap(() => localStorage.removeItem(this.TOKEN_KEY)),
      map(() => void 0),
      catchError(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        return of(void 0);
      })
    );
  }

  /* ────────── TOKEN-UTILS ────────── */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Kurz-Getter für den Interceptor o. Ä. */
  get token(): string | null {
    return this.getToken();
  }

  /* ────────── Helper ────────── */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
