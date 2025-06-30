// src/app/app.routes.ts
import { Routes } from '@angular/router';

/* Standalone-Komponenten */
import { LoginComponent }          from './pages/login/login.component';
import { SignupComponent }         from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LostPasswordComponent }   from './pages/lost-password/lost-password.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { PrivacyComponent }        from './pages/privacy/privacy.component';
import { ImprintComponent }        from './pages/imprint/imprint.component';

import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },

  { path: 'login',           component: LoginComponent },
  { path: 'signup',          component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password',  component: LostPasswordComponent },

  /* E-Mail-Verifikation */
  {
    path: 'email-verify',
    loadComponent: () =>
      import('./pages/email-verify/email-verify.component')
        .then(m => m.EmailVerifyComponent),
  },

  { path: 'privacy',   component: PrivacyComponent },
  { path: 'imprint',   component: ImprintComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'signup' },
];
