/* ==========================================================================
   ARCHIVO: promociones-ofertas.component.ts
   MÓDULO 6: Promociones y Cupones (Matews Abrahan Narvaez Cabeza).
   FUNCIÓN: Sección "Ofertas de Temporada" (/promociones/ofertas). CRUD en
            memoria de campañas relámpago con filtro por alianza bancaria.
            Los datos viven en este componente (sin servicio propio).
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface CampanaOferta {
  id: number;
  titulo: string;
  descripcion: string;
  alianza: string;
  descuento: number;
  codigo: string;
  diasRestantes: number;
}

export interface BorradorCampana {
  titulo: string;
  alianza: string;
  descuento: number | null;
  codigo: string;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-promociones-ofertas',
  styleUrl: './promociones-ofertas.component.css',
  templateUrl: './promociones-ofertas.component.html',
})
export class PromocionesOfertasComponent {
  readonly alianzas: string[] = [
    'Banco Pacífico — Diferido sin intereses',
    'Banco Pichincha — Descuento directo',
    'Transferencia / Deuna'
  ];
  readonly descuentoMinimo: number = 5;
  readonly descuentoMaximo: number = 70;
  private readonly diasPorDefecto: number = 15;

  // Two-way binding del filtro por alianza ('Todos' = sin filtro)
  filtroAlianza: string = 'Todos';

  campanas: CampanaOferta[] = [
    {
      id: 1,
      titulo: 'Cyber Travel Galápagos',
      descripcion: 'Galápagos Imperial (5D/4N) con vuelo y hospedaje incluidos.',
      alianza: this.alianzas[0],
      descuento: 20,
      codigo: 'UGVIAJA20',
      diasRestantes: 3
    },
    {
      id: 2,
      titulo: 'Feriado Ruta de los Volcanes',
      descripcion: 'Cotopaxi, Quilotoa y Baños (3D/2N) en fechas de feriado.',
      alianza: this.alianzas[1],
      descuento: 15,
      codigo: 'ANDES15',
      diasRestantes: 5
    },
    {
      id: 3,
      titulo: 'Escapada Ruta del Spondylus',
      descripcion: 'Montañita y Puerto López (3D/2N) con tour a Isla de la Plata.',
      alianza: this.alianzas[2],
      descuento: 10,
      codigo: 'SPONDY10',
      diasRestantes: 8
    }  
  ];

  // Two-way binding del formulario embebido (sin modales)
  nuevaCampana: BorradorCampana = this.crearBorrador();

  constructor(private router: Router) {}

  campanasFiltradas(): CampanaOferta[] {
    return this.filtroAlianza === 'Todos'
      ? this.campanas
      : this.campanas.filter((campana) => campana.alianza === this.filtroAlianza);
  }

  // El código se guarda en mayúsculas y sin espacios
  codigoNormalizado(): string {
    return this.nuevaCampana.codigo.toUpperCase().replace(/\s+/g, '');
  }

  codigoRepetido(): boolean {
    const codigo = this.codigoNormalizado();
    return codigo !== '' && this.campanas.some((campana) => campana.codigo === codigo);
  }

  formularioValido(): boolean {
    const borrador = this.nuevaCampana;
    const descuento = Number(borrador.descuento);
    return (
      borrador.titulo.trim().length >= 5 &&
      this.alianzas.includes(borrador.alianza) &&
      descuento >= this.descuentoMinimo &&
      descuento <= this.descuentoMaximo &&
      this.codigoNormalizado().length >= 3 &&
      !this.codigoRepetido()
    );
  }

  // Event binding (click): Create
  publicarCampana(): void {
    if (!this.formularioValido()) {
      return;
    }
    const siguiente = Math.max(0, ...this.campanas.map((campana) => campana.id)) + 1;
    const nueva: CampanaOferta = {
      id: siguiente,
      titulo: this.nuevaCampana.titulo.trim(),
      descripcion: 'Campaña vigente de AndesTravel UG para paquetes seleccionados.',
      alianza: this.nuevaCampana.alianza,
      descuento: Number(this.nuevaCampana.descuento),
      codigo: this.codigoNormalizado(),
      diasRestantes: this.diasPorDefecto
    };
    this.campanas = [nueva, ...this.campanas];
    this.nuevaCampana = this.crearBorrador();
  }

  // Event binding (click): Delete
  finalizarCampana(campana: CampanaOferta): void {
    this.campanas = this.campanas.filter((item) => item.id !== campana.id);
  }

  // Event binding (click): abre /promociones/cupones con el código como parámetro de consulta
  gestionarCupon(campana: CampanaOferta): void {
    this.router.navigate(['/promociones', 'cupones'], { queryParams: { codigo: campana.codigo } });
  }

  esUltimosDias(campana: CampanaOferta): boolean {
    return campana.diasRestantes <= 3;
  }

  private crearBorrador(): BorradorCampana {
    return { titulo: '', alianza: this.alianzas[0], descuento: null, codigo: '' };
  }
}
