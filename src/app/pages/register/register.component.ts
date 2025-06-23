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

  form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        // verlangt mindestens ein ".", danach min. 2 Buchstaben
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/)
      ]
    ],
  });

  /** Für Template-Zugriff */
  get emailCtrl() {
    return this.form.get('email')!;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.emailCtrl.value!;
    // Nur Weiterleitung – Query-Param „email“ übergeben
    this.router.navigate(['/signup'], { queryParams: { email } });
  }
}
