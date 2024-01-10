import {
  ApplicationConfig,
  InjectionToken,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  HttpClientModule,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { routes } from './app.routes';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { SelectivePreloadingStrategyService } from './services/selective-preloading-strategy.service';
import { noopInterceptor } from './interceptor/noop.interceptor';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  DownloadOutline,
  FileTwoTone,
  PlusOutline,
} from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DragulaModule } from 'ng2-dragula';

const icons: IconDefinition[] = [PlusOutline, DownloadOutline, FileTwoTone];

registerLocaleData(en);

export type AppConfig = {
  title: string;
  theme: string;
  baseApiUrl: string;
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(SelectivePreloadingStrategyService)),
    provideHttpClient(withInterceptors([noopInterceptor])),
    importProvidersFrom([
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false,
      }),
      BrowserModule,
      NzIconModule.forRoot(icons),
      DragulaModule.forRoot(),
    ]),
    provideAnimations(),
    {
      provide: APP_CONFIG,
      useValue: {
        title: 'Tour of heroes',
        theme: 'light',
        baseApiUrl: 'http://localhost:3000',
      },
    },
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
  ],
};
