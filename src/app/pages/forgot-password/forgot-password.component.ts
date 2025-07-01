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
    RouterModule,   // for routerLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  readonly form: FormGroup;
  sending = false;
  private _success = false;
  private _message = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailCtrl(): AbstractControl {
    return this.form.get('email')!;
  }

  get serverMessage(): string {
    return this._message;
  }

  get isSuccess(): boolean {
    return this._success;
  }

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
      }
    });
  }
}
