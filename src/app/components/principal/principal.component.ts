/* ==========================================================================
   ARCHIVO: src/app/components/principal/principal.component.ts
   FUNCIÓN: Página principal de AndesTravel UG tras iniciar sesión. Muestra el
            banner y las tarjetas de los 5 módulos; cada tarjeta navega a la URL
            de su módulo (el catálogo vive en ModulosService).
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModuloGrupo, ModulosService } from '../../services/modulos.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  // Los 5 módulos vienen de ModulosService (fuente única).
  // Cuando un integrante termine su módulo, cambia SOLO el estado de su línea allí.
  modulosGrupo: ModuloGrupo[];

  constructor(
    public authService: AuthService,
    private modulosService: ModulosService,
    private router: Router
  ) {
    this.modulosGrupo = this.modulosService.modulosGrupo;
  }

  // Event binding: abre la URL del módulo (/seguridad, /catalogo, ...)
  irAModulo(modulo: ModuloGrupo): void {
    this.router.navigate(['/', modulo.ruta]);
  }

  modulosFuncionales(): number {
    return this.modulosGrupo.filter((modulo) => modulo.estado === 'Funcional').length;
  }
}