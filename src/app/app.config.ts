import { ApplicationConfig, LOCALE_ID, } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';


import registerPt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(registerPt);

export const appConfig: ApplicationConfig = {
  providers: [
    // Troque 'provideZoneChangeDetection' por 'provideExperimentalZonelessChangeDetection'
  
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};