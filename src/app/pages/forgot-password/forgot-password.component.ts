// src/app/pages/forgot-password/forgot-password.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  serverMessage: string | null = null;
  isSuccess = false;

  /** Für den Zugriff im Template */
  get emailCtrl() {
    return this.form.get('email')!;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.emailCtrl.value!;
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.isSuccess = true;
        this.serverMessage = `A password reset link has been sent to ${email}.`;
        this.form.disable();

        // Nach 3 Sekunden zu Login weiterleiten
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000);
      },
      error: err => {
        this.isSuccess = false;
        this.serverMessage = err.error?.detail || 'Error sending reset link.';
      }
    });
  }
}
