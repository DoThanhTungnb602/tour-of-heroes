import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { HeroesComponent } from './heroes/heroes.component';
import { MessagesComponent } from './messages/messages.component';
import { AsyncObservablePipeComponent } from './async-observable-pipe/async-observable-pipe.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,

    HeroesComponent,
    MessagesComponent,
    AsyncObservablePipeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tour of heros';
}
