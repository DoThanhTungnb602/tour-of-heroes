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
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-crisis-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './crisis-list.component.html',
  styleUrl: './crisis-list.component.css',
})
export default class CrisisListComponent {
  private crisisService: CrisisService = inject(CrisisService);
  private messageService: MessageService = inject(MessageService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public selectedId: number = 0;
  public crises$!: Observable<Crisis[]>;

  ngOnInit() {
    this.crises$ = this.getCrises();
  }

  getCrises(): Observable<Crisis[]> {
    return this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.selectedId = Number(params.get('id'));
        return this.crisisService.getCrises();
      })
    );
  }

  delete(crisis: Crisis) {
    this.crisisService.deleteCrisis(crisis.id).subscribe(() => {
      this.messageService.add(`Deleted crisis ${crisis.name}`);
    });
  }
}
