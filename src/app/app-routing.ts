import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/storefront.page').then((module) => module.StorefrontPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('../bo/admin-dashboard.page').then((module) => module.AdminDashboardPage)
  },
  { path: '**', redirectTo: '' }
];
