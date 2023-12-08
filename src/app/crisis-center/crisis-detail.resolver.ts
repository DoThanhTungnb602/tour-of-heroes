import { ResolveFn, Router } from '@angular/router';
import { Crisis } from '../models/crisis';
import { inject } from '@angular/core';
import { CrisisService } from '../services/crisis.service';
import { EMPTY, of, switchMap } from 'rxjs';

export const crisisDetailResolver: ResolveFn<Crisis> = (route) => {
  const router = inject(Router);
  const crisisService: CrisisService = inject(CrisisService);
  const id = route.paramMap.get('id');
  return crisisService.getCrisis(Number(id)).pipe(
    switchMap((crisis) => {
      if (crisis) return of(crisis);
      return EMPTY;
    })
  );
};
