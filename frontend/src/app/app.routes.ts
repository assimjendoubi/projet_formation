import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Learner routes
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/learner-dashboard/learner-dashboard.component').then(m => m.LearnerDashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'catalog',
    canActivate: [authGuard],
    loadComponent: () => import('./features/formations/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'formations/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/formations/formation-detail/formation-detail.component').then(m => m.FormationDetailComponent)
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'formations',
        loadComponent: () => import('./features/formations/admin-formations/admin-formations.component').then(m => m.AdminFormationsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
