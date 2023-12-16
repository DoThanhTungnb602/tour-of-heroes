import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { routes } from './app.routes';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { SelectivePreloadingStrategyService } from './services/selective-preloading-strategy.service';
import { noopInterceptor } from './interceptor/noop.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    provideRouter(routes, withPreloading(SelectivePreloadingStrategyService)),
    provideHttpClient(withInterceptors([noopInterceptor])),
    importProvidersFrom([
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false,
      }),
      BrowserModule,
    ]),
    provideAnimations(),
  ],
};
