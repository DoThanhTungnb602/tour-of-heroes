import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CrisisService } from '../../services/crisis.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Crisis } from '../../models/crisis';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';

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
  private dialogService: DialogService = inject(DialogService);

  private unsubscribeAll: Subject<void> = new Subject<void>();
  public crisis!: Crisis;
  public editName: string = '';

  ngOnInit(): void {
    this.getCrisis();
  }

  getCrisis(): void {
    this.route.data
      .pipe(
        map((data) => data['crisis']),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe((crisis) => {
        this.crisis = crisis;
        this.editName = crisis.name;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  goBackCrises(crisis: Crisis): void {
    const crisisId = crisis ? crisis.id : null;
    this.router.navigate(['../', { id: crisisId }], {
      relativeTo: this.route,
    });
  }

  updateCrisis(crisis: Crisis): void {
    if (!crisis) return;
    this.crisisService
      .updateCrisis(crisis)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        this.goBackCrises(crisis);
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.crisis || this.crisis.name === this.editName) return true;
    return this.dialogService.confirm('Discard changes?');
  }
}
