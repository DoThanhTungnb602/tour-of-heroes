import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./heroes.component'),
    data: { animation: 'heroes' },
  },
  {
    path: 'status',
    loadComponent: () => import('./hero-status/hero-status.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./hero-detail/hero-detail.component'),
    data: { animation: 'hero' },
  },
] satisfies Routes;
