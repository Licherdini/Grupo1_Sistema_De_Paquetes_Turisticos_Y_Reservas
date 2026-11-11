/* ==========================================================================
   ARCHIVO: src/app/guards/auth.guard.ts
   FUNCIÓN: Protege /principal. Si no hay sesión activa en AuthService,
            redirige a /login (Router como capa de Control del patrón MVC).
   ========================================================================== */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  // Inyección de dependencias con inject() dentro de una función de guardia
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.estaLogueado ? true : router.createUrlTree(['/login']);
};