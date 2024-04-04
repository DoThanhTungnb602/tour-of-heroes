import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';

import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';
import { MessageService as AppMessageService } from '../../services/message.service';

import HeroDetailComponent from '../hero-detail/hero-detail.component';
import { Observable, switchMap } from 'rxjs';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    HeroDetailComponent,
    RouterLink,
    CKEditorModule,
    ConfirmDialogModule,
    ButtonModule
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css',
})
export default class HeroListComponent {
  private heroService: HeroService = inject(HeroService);
  private messageService: AppMessageService = inject(AppMessageService);
  private route: ActivatedRoute = inject(ActivatedRoute);


  public selectedId: number = 0;
  public heroes$!: Observable<Hero[]>;
  public Editor = ClassicEditor;

  ngOnInit() {
    // this.heroes$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     this.selectedId = Number(params.get('id'));
    //     return this.heroService.getHeroes();
    //   })
    // );
    this.heroes$ = this.heroService.getHeroes();
  }

  // confirm(event: Event) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Are you sure that you want to proceed?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptIcon: 'none',
  //     rejectIcon: 'none',
  //     rejectButtonStyleClass: 'p-button-text',
  //     accept: () => {
  //       this.primeNgMessageService.add({
  //         severity: 'info',
  //         summary: 'Confirmed',
  //         detail: 'You have accepted',
  //       });
  //     },
  //     reject: () => {
  //       this.primeNgMessageService.add({
  //         severity: 'error',
  //         summary: 'Rejected',
  //         detail: 'You have rejected',
  //         life: 3000,
  //       });
  //     },
  //   });
  // }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe((_) => {
      this.messageService.add(`HeroService: Deleted hero id=${hero.id}`);
    });
  }
}
