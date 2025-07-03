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

  /* Reactive form: single “email” field */
  form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        /* regex: must contain a dot and at least two letters afterward */
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/),
      ],
    ],
  });

  /* Expose control for template bindings */
  get emailCtrl() {
    return this.form.get('email')!;
  }

  /* Submit handler */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.emailCtrl.value!;
    /* Redirect to /signup, passing the email as query param */
    this.router.navigate(['/signup'], { queryParams: { email } });
  }
}
