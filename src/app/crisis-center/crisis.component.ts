import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-crisis',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <h2>Crisis Center</h2>
    <router-outlet />
  `,
  styles: ``,
})
export default class CrisisComponent {}
