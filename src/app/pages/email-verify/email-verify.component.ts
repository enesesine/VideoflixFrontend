import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-verify',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss'],
})
export class EmailVerifyComponent implements OnInit {
  /* Injected services */
  private route  = inject(ActivatedRoute);
  private auth   = inject(AuthService);
  private router = inject(Router);

  /* UI state */
  loading = true; // while waiting for API response
  ok      = false; // verification successful
  err     = false; // verification failed

  ngOnInit(): void {
    // verification code comes from query string
    const code = this.route.snapshot.queryParamMap.get('code')!;
    this.auth.verifyEmail(code).subscribe({
      next: () => {
        this.ok = true;
        this.loading = false;
        // short delay, then redirect to login
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.err = true;
        this.loading = false;
      },
    });
  }
}
