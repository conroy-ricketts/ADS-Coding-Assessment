import { ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withHashLocation } from '@angular/router'

import { HttpClientModule } from '@angular/common/http'
import { provideServiceWorker } from '@angular/service-worker'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideServiceWorker(
      'ngsw-worker.js',
      {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      }
    ),
    importProvidersFrom(HttpClientModule)
  ]
}
