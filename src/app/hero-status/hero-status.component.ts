import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from '../models/hero';

@Component({
  selector: 'app-hero-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-status.component.html',
  styleUrl: './hero-status.component.css'
})
export class HeroStatusComponent {
  @Input() hero!: Hero;
}
