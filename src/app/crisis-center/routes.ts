import { Routes } from '@angular/router';
import { canDeactivateGuard } from '../guards/can-deactivate.guard';
import { crisisDetailResolver } from './crisis-detail.resolver';

export default [
  {
    path: '',
    loadComponent: () => import('./crisis.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./crisis-list/crisis-list.component'),
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./crisis-detail/crisis-detail.component'),
            canDeactivate: [canDeactivateGuard],
            resolve: {
              crisis: crisisDetailResolver,
            },
          },
          {
            path: '',
            loadComponent: () =>
              import('./crisis-center-home/crisis-center-home.component'),
          },
        ],
      },
    ],
  },
] satisfies Routes;
