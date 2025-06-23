// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api/auth';
  private readonly TOKEN_KEY = 'videoflix_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/`, { email, password })
      .pipe(tap(res => this.saveToken(res.token)));
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register/`, { username, email, password })
      .pipe(tap(res => this.saveToken(res.token)));
  }

  /** Neues Endpunkt für Forgot Password */
  forgotPassword(email: string): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(
      `${this.apiUrl}/forgot-password/`,
      { email }
    );
  }

  /** Token im LocalStorage speichern */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** Aktuell gespeicherten Token zurückgeben */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Convenience-Getter */
  get token(): string | null {
    return this.getToken();
  }

  /** Logout: Token entfernen */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /** Prüfen, ob eingeloggt */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
