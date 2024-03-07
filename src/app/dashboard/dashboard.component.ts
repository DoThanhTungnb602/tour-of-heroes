import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../models/hero';
import { HeroService } from '../services/hero.service';
import { RouterLink } from '@angular/router';
import { HeroSearchComponent } from '../heroes/hero-search/hero-search.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeroSearchComponent,
    NzDatePickerModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  date: any;
  getWeek($event: Event) {
    console.log($event);
  }
  heroService: HeroService = inject(HeroService);
  heroes: Hero[] = [];

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService
      .getHeroes()
      .subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }
}
