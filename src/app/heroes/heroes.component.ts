import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroFormComponent } from './hero-form/hero-form.component';
import HeroListComponent from './hero-list/hero-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, HeroFormComponent, HeroListComponent, RouterOutlet],
  template: `
    <h2>My Heroes</h2>
    <app-hero-form />
    <router-outlet />
  `,
})
export default class HeroesComponent {}
