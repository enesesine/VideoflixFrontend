import { Routes } from '@angular/router';

// die standalone-Komponenten importieren
import { LoginComponent }     from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { Signup } from './pages/signup/signup.component';
import { ForgotPassword } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default-Redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public
   { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: Signup },
  { path: 'forgot-password', component: ForgotPassword },

  // Geschützter Bereich
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // 404
  { path: '**', redirectTo: 'register' },
];
