import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  /* DI-Shortcuts */
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  /* ─────────────── Reactive Form ─────────────── */
  form = this.fb.group(
    {
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatch }
  );

  /* UI-State */
  showPassword        = false;
  showConfirmPassword = false;
  serverError:   string | null = null;
  successMessage: string | null = null;

  /* Prefill e-mail via query-param */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.form.patchValue({ email: params['email'] });
      }
    });
  }

  /* Custom Validator */
  private passwordsMatch(group: AbstractControl) {
    const pw  = group.get('password')?.value;
    const pw2 = group.get('confirmPassword')?.value;
    return pw && pw === pw2 ? null : { mismatch: true };
  }

  /* ─────────────── Submit Handler ─────────────── */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value as { email: string; password: string };

    this.auth.signup(email, password).subscribe({
      next: () => {
        this.successMessage = 'Registrierung erfolgreich – bitte E-Mail bestätigen.';
        this.serverError    = null;
        this.form.reset();
        // → ggf. Redirect z. B. auf /login nach 3 s
        // setTimeout(() => this.router.navigateByUrl('/login'), 3000);
      },
      error: (err: unknown) => {
        console.error('Signup error:', err);
        const e = err as any;
        this.serverError =
          e?.error?.email?.[0] ||
          e?.error?.password?.[0] ||
          e?.error?.non_field_errors?.[0] ||
          'Registrierung fehlgeschlagen. Bitte erneut versuchen.';
        this.successMessage = null;
      },
    });
  }

  /* ─────────────── UI Helper ─────────────── */
  togglePassword():        void { this.showPassword        = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }
}
