import { Routes } from '@angular/router';
import HeroesComponent from './heroes.component';
import HeroListComponent from './hero-list/hero-list.component';
import HeroDetailComponent from './hero-detail/hero-detail.component';

export default [
  {
    path: '',
    component: HeroesComponent,
    children: [
      {
        path: '',
        component: HeroListComponent,
        data: { animation: 'heroes' },
      },
      {
        path: 'status',
        loadComponent: () => import('./hero-status/hero-status.component'),
      },
      {
        path: ':id',
        component: HeroDetailComponent,
        data: { animation: 'hero' },
      },
    ],
  },
] satisfies Routes;
