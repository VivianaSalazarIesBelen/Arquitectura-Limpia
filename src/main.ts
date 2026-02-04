import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { App, routes } from './app/app'; // ✅ Ahora sí se puede importar

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
}).catch(err => console.error(err));
