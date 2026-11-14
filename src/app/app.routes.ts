/* ==========================================================================
   ARCHIVO: src/app/app.routes.ts
    FUNCIÓN: Rutas de la aplicación. Cada ruta puede tener un componente y/o hijos.
    creado por: Jhon Herrera, Angie Lopez, Sebastián Acosta, Kenny Ormaza, Danny Guaman, Matews Narvaez
   ========================================================================== */

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { ModuloLayoutComponent } from './components/modulo-layout/modulo-layout.component';
import { SeguridadSesionComponent } from './components/seguridad/seguridad-sesion/seguridad-sesion.component';
import { SeguridadPerfilesComponent } from './components/seguridad/seguridad-perfiles/seguridad-perfiles.component';
import { SeguridadPerfilDetalleComponent } from './components/seguridad/seguridad-perfil-detalle/seguridad-perfil-detalle.component';
import { SeguridadPerfilFormularioComponent } from './components/seguridad/seguridad-perfil-formulario/seguridad-perfil-formulario.component';
import { SeguridadAccesosComponent } from './components/seguridad/seguridad-accesos/seguridad-accesos.component';
import { ModuloCatalogoComponent } from './components/catalogo/catalogo.component';
import { ModuloProveedoresComponent } from './components/proveedores/proveedores.component';
import { ModuloCotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ModuloFacturacionComponent } from './components/facturacion/facturacion.component';
import { PromocionesOfertasComponent } from './components/promociones/promociones-ofertas/promociones-ofertas.component';
import { PromocionesCuponesComponent } from './components/promociones/promociones-cupones/promociones-cupones.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent, canActivate: [authGuard] },

  // Módulo 1: Seguridad y Perfiles (Jhon Herrera)
  {
    path: 'seguridad',
    component: ModuloLayoutComponent,
    canActivate: [authGuard],
    data: { moduloId: 1 },
    children: [
      { path: '', redirectTo: 'sesion', pathMatch: 'full' },
      { path: 'sesion', component: SeguridadSesionComponent },
      { path: 'perfiles', component: SeguridadPerfilesComponent },
      { path: 'perfiles/nuevo', component: SeguridadPerfilFormularioComponent, data: { modo: 'crear' } },
      { path: 'perfiles/:usuario', component: SeguridadPerfilDetalleComponent },
      { path: 'perfiles/:usuario/editar', component: SeguridadPerfilFormularioComponent, data: { modo: 'editar' } },
      { path: 'accesos', component: SeguridadAccesosComponent }
    ]
  },

  // Módulo 2: Catálogo de Paquetes (Angie Lopez)
  {
    path: 'catalogo',
    component: ModuloLayoutComponent,
    canActivate: [authGuard],
    data: { moduloId: 2 },
    children: [{ path: '', component: ModuloCatalogoComponent }]
  },

  // Módulo 3: Proveedores, Hoteles y Transporte (Sebastián Acosta)
  {
    path: 'proveedores',
    component: ModuloLayoutComponent,
    canActivate: [authGuard],
    data: { moduloId: 3 },
    children: [{ path: '', component: ModuloProveedoresComponent }]
  },

  // Módulo 4: Cotizaciones y Reservas (Kenny Ormaza)
  {
    path: 'cotizaciones',
    component: ModuloLayoutComponent,
    canActivate: [authGuard],
    data: { moduloId: 4 },
    children: [
      { path: '', redirectTo: 'cotizador', pathMatch: 'full' },
      { path: 'cotizador', component: ModuloCotizacionesComponent },
      { path: 'reservas', component: ReservasComponent }
    ]
  },

  // Módulo 5: Facturación, Pagos y Reseñas (Danny Guaman)
  {
    path: 'facturacion',
    component: ModuloLayoutComponent,
    canActivate: [authGuard],
    data: { moduloId: 5 },
    children: [{ path: '', component: ModuloFacturacionComponent }]
  },

  // Módulo 6: Promociones y Cupones (Matews Narvaez)
  {
    path: 'promociones',
    component: ModuloLayoutComponent,
    canActivate: [authGuard],
    data: { moduloId: 6 },
    children: [
      { path: '', redirectTo: 'ofertas', pathMatch: 'full' },
      { path: 'ofertas', component: PromocionesOfertasComponent },
      { path: 'cupones', component: PromocionesCuponesComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];