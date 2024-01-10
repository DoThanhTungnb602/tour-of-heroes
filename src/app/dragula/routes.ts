import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./form-layout-setup/form-layout-setup.component'),
  },
] satisfies Routes;
