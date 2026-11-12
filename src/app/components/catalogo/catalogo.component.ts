/* ==========================================================================
   ARCHIVO: src/app/components/catalogo/catalogo.component.ts
   FUNCIÓN: Bosquejo del Módulo 2 (Angie Lopez Mena). Reemplazar por la
            implementación real del Catálogo de Paquetes y Destinos.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulo-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html'
})
export class ModuloCatalogoComponent {
  objetivo: string =
    'Gestionar y presentar la oferta turística multidestino de forma estructurada, facilitando la búsqueda por regiones y temporadas.';

  funcionesPrevistas: string[] = [
    'Destinos por regiones del Ecuador (Costa, Sierra, Amazonía e Insular) con *ngFor.',
    'Filtro de búsqueda en tiempo real con Two-Way Binding.',
    'Fichas por paquete: itinerario por días, servicios incluidos, cupos y tarifa base.',
    'Etiquetas de estado dinámicas con [ngClass] (Disponible, Últimos cupos, Agotado).'
  ];
}