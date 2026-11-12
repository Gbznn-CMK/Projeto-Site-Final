import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeMockData } from './app/core/data/mock-data';

initializeMockData();
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
