import { Routes } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [PlusOutline];

export default [
  {
    path: '',
    loadComponent: () => import('./dynamic-form/dynamic-form.component'),
  },
] satisfies Routes;
