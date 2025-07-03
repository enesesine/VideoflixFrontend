import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   * @param auth   Service that exposes the current auth state.
   * @param router Angular Router used for redirection when the user
   *               is not authenticated.
   */
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Determines whether a route can be activated.
   * Redirects to `/login` and returns `false` when the user
   * is not logged in; otherwise returns `true`.
   */
  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;              // user is authenticated → allow access
    }
    this.router.navigate(['/login']); // not authenticated → redirect
    return false;
  }
}
