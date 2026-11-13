/* ==========================================================================
   ARCHIVO: src/app/app.routes.ts
   TEORÍA DEL CURSO: Capa de control (Router) que define la navegación entre
                     las vistas de la SPA (Diapositivas 10 y 11).
   ========================================================================== */

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { authGuard } from './guards/auth.guard';
import { ReservasComponent } from './components/reservas/reservas.component';
// Dentro de routes:

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent, canActivate: [authGuard] }, // <-- Coma obligatoria aquí
  { path: 'reservas', component: ReservasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];


