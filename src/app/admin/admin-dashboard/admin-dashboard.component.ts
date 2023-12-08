import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export default class AdminDashboardComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);

  public sessionId!: Observable<string>;
  public token!: Observable<string>;

  ngOnInit() {
    this.sessionId = this.route.queryParamMap.pipe(
      map((params) => params.get('sessionId') || 'None')
    );
    this.token = this.route.fragment.pipe(
      map((fragment) => fragment || 'None')
    );
  }
}
