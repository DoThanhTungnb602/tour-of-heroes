import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./ngx-charts/ngx-charts.component'),
  },
] satisfies Routes;
