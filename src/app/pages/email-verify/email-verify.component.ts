// src/app/pages/email-verify/email-verify.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-verify',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="center" style="padding:2rem; text-align:center">
      <h2 *ngIf="ok" style="color:#4CAF50">✔ Your email is confirmed!</h2>
      <h2 *ngIf="err" style="color:#E53935">✖ Verification failed or expired.</h2>
      <p *ngIf="ok">Redirecting to login…</p>
      <p *ngIf="err">Please request a new confirmation email.</p>
    </div>
  `,
})
export class EmailVerifyComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private auth   = inject(AuthService);
  private router = inject(Router);

  ok  = false;
  err = false;

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code')!;
    this.auth.verifyEmail(code).subscribe({
      next: () => {
        this.ok = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.err = true;
      },
    });
  }
}
