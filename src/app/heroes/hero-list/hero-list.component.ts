import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';

import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';
import { MessageService } from '../../services/message.service';

import HeroDetailComponent from '../hero-detail/hero-detail.component';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [CommonModule, HeroDetailComponent, RouterLink],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css',
})
export default class HeroListComponent {
  private heroService: HeroService = inject(HeroService);
  private messageService: MessageService = inject(MessageService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public selectedId: number = 0;
  public heroes$!: Observable<Hero[]>;

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroes$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.selectedId = Number(params.get('id'));
        return this.heroService.getHeroes();
      }),
    );
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe((_) => {
      this.messageService.add(`HeroService: Deleted hero id=${hero.id}`);
    });
  }
}
