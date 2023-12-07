import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CrisisService } from '../../services/crisis.service';
import { Observable } from 'rxjs';
import { Crisis } from '../../models/crisis';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crisis-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crisis-detail.component.html',
  styleUrl: './crisis-detail.component.css',
})
export default class CrisisDetailComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private crisisService: CrisisService = inject(CrisisService);
  public crisis$!: Observable<Crisis>;

  ngOnInit(): void {
    this.getCrisis();
  }

  getCrisis(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.crisis$ = this.crisisService.getCrisis(Number(id));
  }

  goBackCrises(crisis: Crisis): void {
    const crisisId = crisis ? crisis.id : null;
    this.router.navigate(['../', { id: crisisId }], {
      relativeTo: this.route,
    });
  }

  updateCrisis(crisis: Crisis): void {
    if(!crisis) return;
    this.crisisService.updateCrisis(crisis).subscribe(() => {
      this.goBackCrises(crisis);
    });
  }
}
