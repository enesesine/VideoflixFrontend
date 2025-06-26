// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** true ⇢ Header anzeigen */
  isDashboard = false;

  constructor(public auth: AuthService, private router: Router) {
    /* Route-Änderungen beobachten → Flag setzen */
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        /* passe ggf. an, falls dein Pfad anders lautet */
        this.isDashboard = evt.urlAfterRedirects.startsWith('/dashboard');
      });
  }

  /** Klick-Handler für Logout */
  onLogout(): void {
    this.auth.logout().subscribe({
      next : () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
