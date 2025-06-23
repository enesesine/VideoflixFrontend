import { Routes } from '@angular/router';

// die standalone-Komponenten importieren
import { LoginComponent }     from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SignupComponent } from './pages/signup/signup.component'; 
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default-Redirect
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // Public
   { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: SignupComponent }, 
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Geschützter Bereich
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // 404
  { path: '**', redirectTo: 'register' },
];
