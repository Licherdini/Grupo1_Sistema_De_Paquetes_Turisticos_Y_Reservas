/* ==========================================================================
   ARCHIVO: src/app/components/modulo-layout/modulo-layout.component.ts
   FUNCIÓN: Layout compartido por los 5 módulos: encabezado del
            módulo, submenú. El módulo se identifica con data: { moduloId } en app.routes.ts.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModuloGrupo, ModulosService } from '../../services/modulos.service';

@Component({
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-modulo-layout',
  styleUrl: './modulo-layout.component.css',
  templateUrl: './modulo-layout.component.html',
})
export class ModuloLayoutComponent {
  modulo: ModuloGrupo | undefined;

  // Inyección de dependencias: la ruta activa (trae el moduloId) y el catálogo de módulos
  constructor(route: ActivatedRoute, modulosService: ModulosService) {
    this.modulo = modulosService.obtenerModulo(route.snapshot.data['moduloId']);
  }
}