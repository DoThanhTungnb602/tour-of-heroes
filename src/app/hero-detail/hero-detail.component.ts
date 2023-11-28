import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../models/hero';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  heroService: HeroService = inject(HeroService);
  location: Location = inject(Location);
  hero!: Hero;

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }
}
