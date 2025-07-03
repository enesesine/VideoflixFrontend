// src/app/pages/signup/signup.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  /* Validator: “password” and “confirmPassword” must match */
  private passwordsMatch: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const pw  = group.get('password')?.value;
    const pw2 = group.get('confirmPassword')?.value;
    return pw && pw === pw2 ? null : { mismatch: true };
  };

  /* Reactive form */
  form = this.fb.group(
    {
      email: [
        '',
        [
          Validators.required,
          /* must contain “@”, a dot, and at least two letters afterwards */
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/),
        ],
      ],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatch },
  );

  /* UI state */
  showPassword        = false;
  showConfirmPassword = false;
  serverError:    string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    /* Prefill email if passed as query parameter */
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.form.patchValue({ email: params['email'] });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value as {
      email: string;
      password: string;
    };

    this.auth.signup(email, password).subscribe({
      next: () => {
        /* Show green success message */
        this.successMessage = 'A confirmation email is on the way.';
        this.serverError    = null;
        this.form.reset();
      },
      error: (err: unknown) => {
        const e = err as any;
        const emailErrors: string[] | undefined = e?.error?.email;

        /* Check for “email already in use” pattern */
        if (
          emailErrors &&
          emailErrors.some(msg => /already exists|taken|been used/i.test(msg))
        ) {
          this.serverError = 'An account with this email already exists.';
        } else {
          this.serverError =
            emailErrors?.[0] ||
            e?.error?.password?.[0] ||
            e?.error?.non_field_errors?.[0] ||
            'Signup failed. Please try again.';
        }
        this.successMessage = null;
      },
    });
  }

  togglePassword():        void { this.showPassword        = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }
}
