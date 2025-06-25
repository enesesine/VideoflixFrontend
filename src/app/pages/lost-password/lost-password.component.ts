import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lost-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss'],
})
export class LostPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  serverMessage: string | null = null;
  isSuccess = false;

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
        this.serverMessage = `A reset link has been sent to ${email}.`;
        this.form.disable();
      },
      error: err => {
        this.isSuccess = false;
        this.serverMessage = err.error?.detail || 'Error sending reset link.';
      }
    });
  }
}
