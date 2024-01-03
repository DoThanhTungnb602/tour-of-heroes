import { Routes } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [PlusOutline];

export default [
  {
    path: '',
    loadComponent: () => import('./diagram/diagram.component'),
  },
  {
    path: 'mermaid',
    loadComponent: () => import('./mermaid-diagram/mermaid-diagram.component'),
  },
  {
    path: 'drawio',
    loadComponent: () => import('./drawio/drawio.component'),
  },
  {
    path: 'mxgraph',
    loadComponent: () => import('./mxgraph/mxgraph.component'),
  },
] satisfies Routes;
