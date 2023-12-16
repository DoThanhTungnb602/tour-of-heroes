import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { CrisisService } from '../services/crisis.service';
import { of, switchMap } from 'rxjs';
import { Crisis } from '../models/crisis';

export const crisisListResolver: ResolveFn<Crisis[]> = (route, state) => {
  const crisisService: CrisisService = inject(CrisisService);

  return crisisService.getCrises().pipe(
    switchMap((crises) => {
      return of(crises);
    })
  );
};
