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
    // Query-Parameter auslesen und E-Mail vorbefüllen
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

    this.serverError = null;
    const email    = this.form.value.email!;
    const password = this.form.value.password!;

    this.auth.register(email, email, password).subscribe({
      next: () => {
        // Success-Meldung anzeigen
        this.successMessage = 
          'Vielen Dank! Eine Bestätigungs-E-Mail wurde an ' +
          email + 
          ' gesendet. Bitte überprüfe dein Postfach.';
        // Formular deaktivieren
        this.form.disable();
      },
      error: err => {
        this.serverError =
          err.error?.email?.[0]
          || err.error?.non_field_errors?.[0]
          || 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
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
