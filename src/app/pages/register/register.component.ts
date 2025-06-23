// src/app/pages/register/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);

  // Formular nur mit E-Mail-Feld
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  serverError: string | null = null;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.value.email!;
    // Weiterleitung auf /signup?email=...
    this.router.navigate(['/signup'], {
      queryParams: { email }
    });
  }
}
