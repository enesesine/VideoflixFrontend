// src/app/pages/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,          // ➊ neu
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Passwort vergessen</h1>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input
        type="email"
        formControlName="email"
        placeholder="E-Mail"
        [class.error]="email.invalid && email.touched"
      />

      <button type="submit" [disabled]="form.invalid || sending">
        Link senden
      </button>
    </form>

    <p *ngIf="message" [class.success]="success" [class.error]="!success">
      {{ message }}
    </p>
  `,
  styles: [`
    input.error { border-color:#ff6b6b }
    .success   { color:#4caf50  }
    .error     { color:#ff6b6b  }
  `]
})
export class ForgotPasswordComponent {

  /* ---------- Reactive Form ---------- */
  readonly form: FormGroup;

  /* ---------- Status ---------- */
  sending = false;
  success = false;
  message = '';

  /* ---------- Ctor ---------- */
  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService
  ) {
    /* Form erst hier bauen */
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /* ---------- Getter ---------- */
  get email(): AbstractControl {
    return this.form.get('email')!;        // ✔ kein Index-Signature-Problem
  }

  /* ---------- Submit ---------- */
  submit(): void {
    if (this.form.invalid) return;

    this.sending = true;
    const emailValue = this.email.value as string;

    this.auth.requestPasswordReset(emailValue).subscribe({
      next: () => {
        this.success = true;
        this.message =
          'Falls die Adresse existiert, wurde eine Mail versendet.';
        this.sending = false;
        this.form.reset();
      },
      error: (_err: unknown) => {
        this.success = false;
        this.message = 'Es ist ein Fehler aufgetreten.';
        this.sending = false;
      }
    });
  }
}
