// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
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
  /** When true, the sticky dashboard header is shown */
  isDashboard = false;

  constructor(public auth: AuthService, private router: Router) {
    /* Watch route changes and update the header flag */
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        /* Adjust the prefix if your dashboard route changes */
        this.isDashboard = evt.urlAfterRedirects.startsWith('/dashboard');
      });
  }

  /** Logout click handler */
  onLogout(): void {
    this.auth.logout().subscribe({
      next : () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
