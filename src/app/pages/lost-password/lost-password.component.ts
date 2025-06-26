// src/app/pages/lost-password/lost-password.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule }  from '@angular/common';
import { RouterModule }  from '@angular/router';
import { AuthService }   from '../../services/auth.service';

@Component({
  selector    : 'app-lost-password',
  standalone  : true,
  imports     : [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl : './lost-password.component.html',
  styleUrls   : ['./lost-password.component.scss'],
})
export class LostPasswordComponent {

  /* ---------- Form ---------- */
  readonly form!: FormGroup;            // nur deklariert

  /* ---------- UI-Status ---------- */
  serverMsg = '';
  isSuccess = false;
  sending   = false;

  constructor(
    private readonly fb : FormBuilder,
    private readonly auth: AuthService
  ) {
    /* jetzt sicher – fb ist bereits injiziert */
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /* ---------- Getter ---------- */
  get email(): AbstractControl {
    return this.form.get('email')!;
  }

  /* ---------- Submit ---------- */
  submit(): void {
    if (this.form.invalid) return;

    this.sending = true;
    const address = this.email.value as string;

    this.auth.requestPasswordReset(address).subscribe({
      next : () => this.finish(true),
      error: () => this.finish(true),      // neutrale Antwort
    });
  }

  /* ---------- Helper ---------- */
  private finish(success: boolean): void {
    this.isSuccess = success;
    this.serverMsg =
      'Falls die Adresse existiert, wurde eine Mail mit einem Reset-Link versendet.';
    this.sending = false;
    this.form.reset();
  }
}
