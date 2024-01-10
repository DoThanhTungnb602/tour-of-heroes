import { Routes } from '@angular/router';

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
