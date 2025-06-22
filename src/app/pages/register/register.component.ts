// src/app/pages/register/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Nur E-Mail-Feld, wie im Template
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  /** Wird vom Template via (ngSubmit)="onSubmit()" aufgerufen */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email!;
    // Hier benutzen wir E-Mail auch als Username und Passwort (Demo-Flow)
    this.auth.register(email, email, 'Pass12345').subscribe({
      next: () => {
        // Nach erfolgreicher Registrierung direkt ins Dashboard
        this.router.navigateByUrl('/dashboard');
      },
      error: err => {
        console.error('Registrierung fehlgeschlagen', err);
        // TODO: Fehler dem User anzeigen
      }
    });
  }
}
