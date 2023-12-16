import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterLink,
  RouterOutlet,
  ParamMap,
} from '@angular/router';
import { CrisisService } from '../../services/crisis.service';
import { Crisis } from '../../models/crisis';
import { MessageService } from '../../services/message.service';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-crisis-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './crisis-list.component.html',
  styleUrl: './crisis-list.component.css',
})
export default class CrisisListComponent {
  private crisisService = inject(CrisisService);
  private messageService = inject(MessageService);

  private unsubscribeAll = new Subject<void>();
  public selectedId = 0;
  public crises$!: Observable<Crisis[]>;

  ngOnInit() {
    this.crises$ = this.getCrises();
  }

  getCrises(): Observable<Crisis[]> {
    return this.crisisService.getCrises().pipe(takeUntil(this.unsubscribeAll));
  }

  delete(crisis: Crisis) {
    this.crisisService.deleteCrisis(crisis.id).subscribe(() => {
      this.messageService.add(`Deleted crisis ${crisis.name}`);
    });
  }
}
