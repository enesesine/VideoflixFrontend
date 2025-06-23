import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000/api/auth';
  private readonly TOKEN_KEY = 'videoflix_token';

  constructor(private http: HttpClient) {}

login(email: string, password: string) {
  return this.http
    .post<AuthResponse>(`${this.apiUrl}/login/`, { email, password })
    .pipe(
      tap(res => this.saveToken(res.token))
    );
}

  register(username: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register/`, { username, email, password })
      .pipe(tap(res => this.saveToken(res.token)));
  }

  /** Token im LocalStorage speichern */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** Gibt den aktuell gespeicherten Token zurück (oder null) */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Optional: Convenience-Getter, damit du auth.token nutzen kannst */
  get token(): string | null {
    return this.getToken();
  }

  /** Logout: Token entfernen */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /** Prüft, ob ein Token vorhanden ist */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
