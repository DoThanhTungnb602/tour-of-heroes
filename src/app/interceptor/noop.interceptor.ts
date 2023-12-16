import { HttpInterceptorFn } from '@angular/common/http';

export const noopInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('noop interceptor');
  return next(req);
};
