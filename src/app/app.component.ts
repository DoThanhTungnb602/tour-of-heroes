import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChildrenOutletContexts,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

import { MessagesComponent } from './messages/messages.component';
import { AsyncObservablePipeComponent } from './shared/components/async-observable-pipe/async-observable-pipe.component';
import { slideInAnimation } from './animations';

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
export class AppComponent {
  title = 'Tour of heros';
  private contexts: ChildrenOutletContexts = inject(ChildrenOutletContexts);

  getAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
