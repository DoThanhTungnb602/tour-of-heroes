import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';

export default [
  {
    path: '',
    loadComponent: () => import('./admin/admin.component'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        children: [
          {
            path: 'crises',
            loadComponent: () =>
              import('./manage-crises/manage-crises.component'),
          },
          {
            path: 'heroes',
            loadComponent: () =>
              import('./manage-heroes/manage-heroes.component'),
          },
          {
            path: '',
            loadComponent: () =>
              import('./admin-dashboard/admin-dashboard.component'),
          },
        ],
      },
    ],
  },
] satisfies Routes;
