// src/app/pages/signup/signup.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class Signup {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordsMatch.bind(this)
  });

  showPassword        = false;
  showConfirmPassword = false;

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

  // hier die !-Operatoren
  const email    = this.form.value.email!;
  const password = this.form.value.password!;

  this.auth.register(email, email, password).subscribe({
    next: () => this.router.navigateByUrl('/dashboard'),
    error: err => console.error('Signup error', err)
  });
}


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
