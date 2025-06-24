import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appRoutesProvider } from './app.routes';
import { UsuarioService } from './componentes/sesion/inicio-sesion/usuario.service'; // ✅ RUTA CORREGIDA

export const appConfig: ApplicationConfig = {
  providers: [
    appRoutesProvider,
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    UsuarioService // ✅ Servicio incluido correctamente
  ]
};
