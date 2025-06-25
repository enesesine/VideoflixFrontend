import { Routes } from '@angular/router';

// deine Standalone-Komponenten importieren
import { LoginComponent }            from './pages/login/login.component';
import { RegisterComponent }         from './pages/register/register.component';
import { SignupComponent }           from './pages/signup/signup.component';
import { ForgotPasswordComponent }   from './pages/forgot-password/forgot-password.component';
import { DashboardComponent }        from './pages/dashboard/dashboard.component';
import { PrivacyComponent }          from './pages/privacy/privacy.component';
import { ImprintComponent }          from './pages/imprint/imprint.component';
import { AuthGuard }                 from './guards/auth-guard';
import { LostPasswordComponent } from './pages/lost-password/lost-password.component';

export const routes: Routes = [
  // Default-Redirect
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // Öffentlich
  { path: 'login',           component: LoginComponent },
  { path: 'register',        component: RegisterComponent },
  { path: 'signup',          component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'privacy',         component: PrivacyComponent },
  { path: 'imprint',         component: ImprintComponent },
  { path: 'lost-password', component: LostPasswordComponent },

  // Geschützter Bereich
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Catch-all
  { path: '**', redirectTo: 'register' },
];

