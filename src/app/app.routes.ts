// src/app/app.routes.ts
import { Routes } from '@angular/router';

/* Stand-alone page components */
import { LoginComponent }          from './pages/login/login.component';
import { SignupComponent }         from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { EmailVerifyComponent }    from './pages/email-verify/email-verify.component';
import { NewPasswordComponent }    from './pages/new-password/new-password.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { PrivacyComponent }        from './pages/privacy/privacy.component';
import { ImprintComponent }        from './pages/imprint/imprint.component';
import { RegisterComponent }       from './pages/register/register.component';

import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  /* Public routes */
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register',        component: RegisterComponent },
  { path: 'login',           component: LoginComponent },
  { path: 'signup',          component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'new-password',    component: NewPasswordComponent },

  /* Email verification is lazy-loaded */
  {
    path: 'email-verify',
    loadComponent: () =>
      import('./pages/email-verify/email-verify.component')
        .then(m => m.EmailVerifyComponent),
  },

  /* Legal pages */
  { path: 'privacy', component: PrivacyComponent },
  { path: 'imprint', component: ImprintComponent },

  /* Protected dashboard */
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  /* Fallback */
  { path: '**', redirectTo: 'register' },
];
