// src/app/app.routes.ts
import { Routes } from '@angular/router';

/* Standalone-Komponenten */
import { LoginComponent }          from './pages/login/login.component';
import { SignupComponent }         from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { EmailVerifyComponent }    from './pages/email-verify/email-verify.component';
import { NewPasswordComponent }    from './pages/new-password/new-password.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { PrivacyComponent }        from './pages/privacy/privacy.component';
import { ImprintComponent }        from './pages/imprint/imprint.component';
import { RegisterComponent } from './pages/register/register.component';

import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'new-password',    component: NewPasswordComponent },
  { path: 'login',           component: LoginComponent },
  { path: 'signup',          component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },

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

  { path: '**', redirectTo: 'register' },
];
