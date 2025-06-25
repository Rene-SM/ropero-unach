import { provideRouter, Routes } from '@angular/router';

// Componentes standalone
import { NuevaPublicacionComponent } from './componentes/sesion/nueva-publicacion/nueva-publicacion.component';
import { InicioComponent } from './componentes/inicio/inicio/inicio.component';
import { InicioSesionComponent } from './componentes/sesion/inicio-sesion/inicio-sesion.component';
import { ComoFuncionaComponent } from './componentes/como-funciona/como-funciona.component';
import { RegistrarComponent } from './componentes/sesion/registrar/registrar.component';
import { DonarGeneralComponent } from './componentes/donar/donar-general/donar-general.component';
import { ComunidadComponent } from './componentes/donar/comunidad/comunidad.component';
import { AgrupacionesComponent } from './componentes/donar/agrupaciones/agrupaciones.component';
import { ConversacionesComponent } from './componentes/conversaciones/conversaciones.component';
import { DetalleProductoComponent } from './componentes/ropa/detalle-producto/detalle-producto.component';
import { RopaGeneralComponent } from './componentes/ropa/ropa-general/ropa-general.component';
import { RopaHombreComponent } from './componentes/ropa/ropa-hombre/ropa-hombre.component';
import { RopaMujerComponent } from './componentes/ropa/ropa-mujer/ropa-mujer.component';
import { AccesoriosComponent } from './componentes/accesorios/accesorios.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'como-funciona', component: ComoFuncionaComponent },
  { path: 'registro', component: RegistrarComponent },

  // ✅ Rutas para donar
  { path: 'donaciones', component: DonarGeneralComponent },
  { path: 'donar', component: DonarGeneralComponent },
  { path: 'donar/comunidad', component: ComunidadComponent },
  { path: 'donar/agrupaciones', component: AgrupacionesComponent },

  // ✅ Categorías de ropa
  { path: 'explorar', component: RopaGeneralComponent },
  { path: 'categoria/ropa-hombre', component: RopaHombreComponent },
  { path: 'categoria/ropa-mujer', component: RopaMujerComponent },
  { path: 'categoria/accesorios', component: AccesoriosComponent },

  // ✅ Otros componentes principales
  {
    path: 'nueva-publicacion',
    loadComponent: () =>
      import('./componentes/sesion/nueva-publicacion/nueva-publicacion.component')
        .then(m => m.NuevaPublicacionComponent)
  },
  {
    path: 'conversaciones',
    loadComponent: () =>
      import('./componentes/conversaciones/conversaciones.component')
        .then(m => m.ConversacionesComponent)
  },
  {
  path: 'conversaciones/:id_solicitud',
    loadComponent: () =>
      import('./componentes/conversaciones/conversaciones.component')
        .then(m => m.ConversacionesComponent)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./componentes/perfil/perfil.component')
        .then(m => m.PerfilComponent)
  },
  {
  path: 'perfil-publico/:id',
  loadComponent: () =>
    import('./componentes/perfil-usuario/perfil-usuario.component')
      .then(m => m.PerfilUsuarioComponent)
},
  { path: 'detalle-producto/:id', component: DetalleProductoComponent },

  // ✅ Rutas del footer (nombre corregido: "footerinfo")
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./componentes/footerinfo/quienes-somos/quienes-somos.component')
        .then(m => m.QuienesSomosComponent)
  },
  {
    path: 'preguntas-frecuentes',
    loadComponent: () =>
      import('./componentes/footerinfo/preguntas-frecuentes/preguntas-frecuentes.component')
        .then(m => m.PreguntasFrecuentesComponent)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./componentes/footerinfo/contacto/contacto.component')
        .then(m => m.ContactoComponent)
  }
];

// ✅ Export necesario para usar en app.config.ts
export const appRoutesProvider = provideRouter(routes);
