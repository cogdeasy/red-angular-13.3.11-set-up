import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'loan-application',
    loadChildren: () => import('./pages/loan-application/loan-application.module').then(m => m.LoanApplicationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'loan-calculator',
    loadChildren: () => import('./pages/loan-calculator/loan-calculator.module').then(m => m.LoanCalculatorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'loan-status',
    loadChildren: () => import('./pages/loan-status/loan-status.module').then(m => m.LoanStatusModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
