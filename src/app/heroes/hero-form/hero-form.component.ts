import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../models/hero';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.css',
})
export class HeroFormComponent {
  private heroService: HeroService = inject(HeroService);
  private messageService: MessageService = inject(MessageService);

  add(name: string): void {
    name = name.trim();
    if (!name) return;
    this.heroService.addHero({ name } as Hero).subscribe((hero) => {
      this.messageService.add(`HeroService: Added hero w/ id=${hero.id}`);
    });
  }
}
