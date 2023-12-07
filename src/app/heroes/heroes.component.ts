import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroFormComponent } from './hero-form/hero-form.component';
import HeroListComponent from './hero-list/hero-list.component';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, HeroFormComponent, HeroListComponent],
  template: `
    <h2>My Heroes</h2>
    <app-hero-form />
    <app-hero-list/>
  `,
  styles: ``,
})
export default class HeroesComponent {
}
