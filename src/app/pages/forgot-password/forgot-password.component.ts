import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // enables routerLink in template
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  /* Reactive form with single email field */
  readonly form: FormGroup;

  /* UI state */
  sending = false;          // disables button while request is in flight
  private _success = false; // success / error flag for serverMessage
  private _message = '';    // text shown to user after submit

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /* Helpers for template bindings */
  get emailCtrl(): AbstractControl {
    return this.form.get('email')!;
  }

  get serverMessage(): string {
    return this._message;
  }

  get isSuccess(): boolean {
    return this._success;
  }

  /* Submit handler */
  onSubmit(): void {
    if (this.form.invalid) return;

    this.sending = true;
    const emailValue = this.emailCtrl.value as string;

    this.auth.requestPasswordReset(emailValue).subscribe({
      next: () => {
        this._success = true;
        this._message =
          'If that address exists, you will receive a password reset email.';
        this.sending = false;
        this.form.reset();
      },
      error: () => {
        this._success = false;
        this._message = 'Something went wrong. Please try again later.';
        this.sending = false;
      },
    });
  }
}
