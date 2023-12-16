import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SelectivePreloadingStrategyService } from '../../services/selective-preloading-strategy.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export default class AdminDashboardComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private preloadStrategy = inject(SelectivePreloadingStrategyService);

  public sessionId!: string;
  public token!: string;
  public preloadedModules: string[] = [];

  ngOnInit() {
    this.sessionId = this.route.snapshot.queryParams['sessionId'] || 'None';
    this.token = this.route.snapshot.fragment || 'None';
    this.preloadedModules = this.preloadStrategy.preloadedModules;
  }
}
