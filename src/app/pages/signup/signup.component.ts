// src/app/pages/signup/signup.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  form = this.fb.group({
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordsMatch.bind(this)
  });

  showPassword        = false;
  showConfirmPassword = false;

  serverError: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    // Read query‐param and prefill email if given
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.form.patchValue({ email });
      }
    });
  }

  passwordsMatch(group: any) {
    return group.value.password === group.value.confirmPassword
      ? null
      : { mismatch: true };
  }

onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  const email = this.form.value.email!;

  this.auth.register(email, email, 'Pass12345').subscribe({
    next: () => {
      this.router.navigateByUrl('/dashboard');
    },
    error: err => {
      console.error('Registration failed, full error object:', err);
      console.error('Status code:', err.status);
      console.error('Response body:', err.error);
      this.serverError =
        err.error?.email?.[0]
        || err.error?.non_field_errors?.[0]
        || 'Registration failed. Please try again.';
    }
  });
}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
