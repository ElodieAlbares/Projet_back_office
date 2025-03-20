import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient()
     
 ],

};
