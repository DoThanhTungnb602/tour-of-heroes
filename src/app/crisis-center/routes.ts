import { Routes } from '@angular/router';

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
