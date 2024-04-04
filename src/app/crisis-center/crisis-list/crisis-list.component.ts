import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CrisisService } from '../../services/crisis.service';
import { Crisis } from '../../models/crisis';
// import { MessageService } from '../../services/message.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-crisis-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ButtonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './crisis-list.component.html',
  styleUrl: './crisis-list.component.css',
  providers: [ConfirmationService, MessageService],
})
export default class CrisisListComponent {
  private crisisService = inject(CrisisService);
  // private messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly primeNgMessageService = inject(MessageService);

  private unsubscribeAll = new Subject<void>();
  public selectedId = 0;
  public crises$!: Observable<Crisis[]>;

  ngOnInit() {
    this.crises$ = this.getCrises();
  }

  getCrises(): Observable<Crisis[]> {
    return this.crisisService.getCrises().pipe(takeUntil(this.unsubscribeAll));
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.primeNgMessageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
      },
      reject: () => {
        this.primeNgMessageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  delete(crisis: Crisis) {
    this.crisisService.deleteCrisis(crisis.id).subscribe(() => {
      // this.messageService.add(`Deleted crisis ${crisis.name}`);
    });
  }
}
