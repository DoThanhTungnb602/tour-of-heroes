import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export default class HeroDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  heroService: HeroService = inject(HeroService);
  router: Router = inject(Router);

  public hero$!: Observable<Hero>;

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    this.hero$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.heroService.getHero(+params.get('id')!))
    )
  }

  goBack(hero: Hero): void {
    const heroId = hero ? hero.id : null;
    this.router.navigate(['/heroes', { id: heroId, foo: 'foo' }]);
  }

  save(hero: Hero): void {
    if (hero) {
      this.heroService.updateHero(hero).subscribe(() => this.goBack(hero));
    }
  }
}
