import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import HERO_ROUTES from './heroes/routes';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component'),
  },
  {
    path: 'heroes',
    children: HERO_ROUTES,
  },
  {
    path: 'crisis-center',
    loadChildren: () => import('./crisis-center/routes'),
    data: { preload: true },
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/routes'),
  },
  {
    path: 'dynamic-form',
    loadChildren: () => import('./dynamic-form/routes'),
  },
  {
    path: 'diagram',
    loadChildren: () => import('./diagram/routes'),
  },
  {
    path: 'dragula',
    loadChildren: () => import('./dragula/routes'),
  },
  {
    path: 'charts',
    loadChildren: () => import('./chart/routes'),
  },
  {
    path: 'compose',
    loadComponent: () =>
      import('./shared/components/compose-message/compose-message.component'),
    outlet: 'popup',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
