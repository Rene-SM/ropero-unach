import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RegistrarComponent } from './componentes/sesion/registrar/registrar.component';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Rutas
import { routes } from './app.routes';

// Componentes
import { AppComponent } from './app.component';
import { InicioComponent } from './componentes/inicio/inicio/inicio.component';
import { ComoFuncionaComponent } from './componentes/como-funciona/como-funciona.component';
import { DonarGeneralComponent } from './componentes/donar/donar-general/donar-general.component';
import { ComunidadComponent } from './componentes/donar/comunidad/comunidad.component';
import { AgrupacionesComponent } from './componentes/donar/agrupaciones/agrupaciones.component';
import { NuevaPublicacionComponent } from './componentes/sesion/nueva-publicacion/nueva-publicacion.component';
import { RopaGeneralComponent } from './componentes/ropa/ropa-general/ropa-general.component'; // ✅ agregado

@NgModule({
  declarations: [
    AppComponent,
    RegistrarComponent,
    InicioComponent,
    ComoFuncionaComponent,
    DonarGeneralComponent,
    ComunidadComponent,
    AgrupacionesComponent,
    NuevaPublicacionComponent,
    RopaGeneralComponent // ✅ agregado
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CommonModule, // ✅ necesario para pipes como slice
    RouterModule, // ✅ necesario para routerLink

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
