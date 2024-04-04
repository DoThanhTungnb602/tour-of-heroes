import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChildrenOutletContexts,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

import { MessagesComponent } from './messages/messages.component';
import { AsyncObservablePipeComponent } from './shared/components/async-observable-pipe/async-observable-pipe.component';
import { slideInAnimation } from './animations';
import { APP_CONFIG } from './app.config';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MessagesComponent,
    AsyncObservablePipeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  title = '';

  private contexts = inject(ChildrenOutletContexts);
  private config = inject(APP_CONFIG);
  private primeNgConfig = inject(PrimeNGConfig);

  constructor() {
    this.title = this.config.title;
  }

  ngOnInit() {
    this.primeNgConfig.ripple = true;
    this.primeNgConfig.setTranslation({
      accept: 'Đồng ý',
      reject: 'Hủy',
    });
  }

  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
