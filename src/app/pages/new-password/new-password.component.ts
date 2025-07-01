// src/app/pages/new-password/new-password.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

export const matchPasswords: ValidatorFn = (group): ValidationErrors | null => {
  const p = group.get('password')?.value;
  const c = group.get('confirm')?.value;
  return p && c && p !== c ? { mismatch: true } : null;
};

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  form: FormGroup;
  sending = false;
  success = false;
  message = '';
  private code: string | null = null;

  // visibility toggles
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm: ['', [Validators.required]],
      },
      { validators: matchPasswords }
    );
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');
    if (!this.code) {
      this.message = 'No reset code found.';
      this.success = false;
      this.sending = false;
    }
  }

  get passwordCtrl(): AbstractControl {
    return this.form.get('password')!;
  }
  get confirmCtrl(): AbstractControl {
    return this.form.get('confirm')!;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.code) return;
    this.sending = true;
    const newPass = this.passwordCtrl.value as string;

    this.auth
      .confirmPasswordReset(this.code, newPass)
      .subscribe({
        next: () => {
          this.success = true;
          this.message = 'Password successfully changed! Redirecting…';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.success = false;
          this.message = 'Error changing password.';
          this.sending = false;
        },
      });
  }
}
