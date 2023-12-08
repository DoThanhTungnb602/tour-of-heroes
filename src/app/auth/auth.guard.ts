import { inject } from '@angular/core';
import { CanActivateFn, NavigationExtras, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const url: string = '/login';

  if (authService.isLoggedIn) return true;

  const sessionId = 123456789;
  const navigationExtras: NavigationExtras = {
    queryParams: { sessionId },
    fragment: 'anchor',
  };

  return router.createUrlTree([url], navigationExtras);
};
