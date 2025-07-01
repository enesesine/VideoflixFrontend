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

  /** Validator: Passwort und Bestätigung müssen übereinstimmen */
  private passwordsMatch: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pw  = group.get('password')?.value;
    const pw2 = group.get('confirmPassword')?.value;
    return pw && pw === pw2 ? null : { mismatch: true };
  };

  /** Reactive Form */
  form = this.fb.group(
    {
      email: [
        '',
        [
          Validators.required,
          // muss "@" und danach "." mit mind. 2 Buchstaben enthalten
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/),
        ],
      ],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatch }
  );

  /** UI-State */
  showPassword        = false;
  showConfirmPassword = false;
  serverError:   string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
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
        // ← hier kommt die grüne Success-Message
        this.successMessage = 'A confirmation email is on the way.';
        this.serverError    = null;
        this.form.reset();
      },
      error: (err: unknown) => {
        const e = err as any;
        const emailErrors: string[] | undefined = e?.error?.email;

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
