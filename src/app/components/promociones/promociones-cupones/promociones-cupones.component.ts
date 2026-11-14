/* ==========================================================================
   ARCHIVO: promociones-cupones.component.ts
   MÓDULO 6: Promociones y Cupones (Matews Abrahan Narvaez Cabeza).
   FUNCIÓN: Sección "Cupones de Descuento" (/promociones/cupones). 
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export type EstadoCupon = 'Vigente' | 'Expirado';
export type FiltroEstadoCupon = 'Todos' | EstadoCupon;

export interface CuponPromocional {
  id: number;
  codigo: string;
  campana: string;
  descuento: number;
  usosTotales: number;
  usosDisponibles: number;
  estado: EstadoCupon;
}

export interface BorradorCupon {
  codigo: string;
  campana: string;
  descuento: number | null;
  usosTotales: number | null;
  estado: EstadoCupon;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-promociones-cupones',
  styleUrl: './promociones-cupones.component.css',
  templateUrl: './promociones-cupones.component.html',
})
export class PromocionesCuponesComponent {
  readonly descuentoMinimo: number = 5;
  readonly descuentoMaximo: number = 70;

  cupones: CuponPromocional[] = [
    { id: 1, codigo: 'UGVIAJA20', campana: 'Cyber Travel Galápagos', descuento: 20, usosTotales: 50, usosDisponibles: 18, estado: 'Vigente' },
    { id: 2, codigo: 'ANDES15', campana: 'Feriado Ruta de los Volcanes', descuento: 15, usosTotales: 100, usosDisponibles: 64, estado: 'Vigente' },
    { id: 3, codigo: 'SPONDY10', campana: 'Escapada Ruta del Spondylus', descuento: 10, usosTotales: 30, usosDisponibles: 30, estado: 'Vigente' },
    { id: 4, codigo: 'NAVIDAD25', campana: 'Promo Navidad anterior', descuento: 25, usosTotales: 20, usosDisponibles: 7, estado: 'Expirado' }
  ];

  // Two-way binding de los filtros (Zona 2)
  textoBusqueda: string = '';
  estadoFiltro: FiltroEstadoCupon = 'Todos';

  // Formulario embebido (Zona 1): modo creación o edición
  borrador: BorradorCupon = this.crearBorrador();
  editandoId: number | null = null;

  // Cupón activado para la cotización actual (aviso superior)
  cuponAplicado: CuponPromocional | null = null;

  constructor(route: ActivatedRoute) {
    // Llega desde "Gestionar / Usar Cupón" de las ofertas: /promociones/cupones?codigo=XXX
    this.textoBusqueda = route.snapshot.queryParamMap.get('codigo') ?? '';
  }

  // Un cupón sin usos disponibles se considera expirado aunque su estado diga Vigente
  estadoEfectivo(cupon: CuponPromocional): EstadoCupon {
    return cupon.usosDisponibles <= 0 ? 'Expirado' : cupon.estado;
  }

  cuponesFiltrados(): CuponPromocional[] {
    const texto = this.textoBusqueda.trim().toLowerCase();
    return this.cupones.filter((cupon) => {
      const coincideTexto =
        texto === '' ||
        cupon.codigo.toLowerCase().includes(texto) ||
        cupon.campana.toLowerCase().includes(texto);
      const coincideEstado =
        this.estadoFiltro === 'Todos' || this.estadoEfectivo(cupon) === this.estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }

  porcentajeRestante(cupon: CuponPromocional): number {
    if (cupon.usosTotales <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(0, Math.round((cupon.usosDisponibles / cupon.usosTotales) * 100)));
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.estadoFiltro = 'Todos';
  }

  // El código se guarda en mayúsculas, solo letras y números
  codigoNormalizado(): string {
    return this.borrador.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  codigoDuplicado(): boolean {
    const codigo = this.codigoNormalizado();
    return (
      codigo !== '' &&
      this.cupones.some((cupon) => cupon.codigo === codigo && cupon.id !== this.editandoId)
    );
  }

  formularioValido(): boolean {
    const borrador = this.borrador;
    const descuento = Number(borrador.descuento);
    const usos = Number(borrador.usosTotales);
    return (
      this.codigoNormalizado().length >= 3 &&
      !this.codigoDuplicado() &&
      borrador.campana.trim().length >= 3 &&
      descuento >= this.descuentoMinimo &&
      descuento <= this.descuentoMaximo &&
      Number.isInteger(usos) &&
      usos >= 1
    );
  }

  // Event binding (click): Create o Update según el modo del formulario
  guardar(): void {
    if (!this.formularioValido()) {
      return;
    }
    const total = Number(this.borrador.usosTotales);

    if (this.editandoId === null) {
      const siguiente = Math.max(0, ...this.cupones.map((cupon) => cupon.id)) + 1;
      this.cupones = [
        {
          id: siguiente,
          codigo: this.codigoNormalizado(),
          campana: this.borrador.campana.trim(),
          descuento: Number(this.borrador.descuento),
          usosTotales: total,
          usosDisponibles: total,
          estado: this.borrador.estado
        },
        ...this.cupones
      ];
    } else {
      const cupon = this.cupones.find((item) => item.id === this.editandoId);
      if (cupon) {
        // Si cambia el límite, los usos disponibles se ajustan por la diferencia
        const diferencia = total - cupon.usosTotales;
        cupon.codigo = this.codigoNormalizado();
        cupon.campana = this.borrador.campana.trim();
        cupon.descuento = Number(this.borrador.descuento);
        cupon.usosTotales = total;
        cupon.usosDisponibles = Math.min(total, Math.max(0, cupon.usosDisponibles + diferencia));
        cupon.estado = this.borrador.estado;
        if (this.cuponAplicado?.id === cupon.id && this.estadoEfectivo(cupon) === 'Expirado') {
          this.cuponAplicado = null;
        }
      }
    }
    this.cancelarEdicion();
  }

  // Event binding (click): carga la fila en el formulario (Update)
  editar(cupon: CuponPromocional): void {
    this.editandoId = cupon.id;
    this.borrador = {
      codigo: cupon.codigo,
      campana: cupon.campana,
      descuento: cupon.descuento,
      usosTotales: cupon.usosTotales,
      estado: cupon.estado
    };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.borrador = this.crearBorrador();
  }

  // Event binding (click): alterna Vigente / Expirado (Update rápido).
  // Un cupón sin usos disponibles no se puede reactivar.
  alternarEstado(cupon: CuponPromocional): void {
    if (cupon.usosDisponibles <= 0) {
      return;
    }
    cupon.estado = cupon.estado === 'Vigente' ? 'Expirado' : 'Vigente';
    if (this.cuponAplicado?.id === cupon.id && cupon.estado === 'Expirado') {
      this.cuponAplicado = null;
    }
  }

  // Event binding (click): Delete
  eliminar(cupon: CuponPromocional): void {
    this.cupones = this.cupones.filter((item) => item.id !== cupon.id);
    if (this.editandoId === cupon.id) {
      this.cancelarEdicion();
    }
    if (this.cuponAplicado?.id === cupon.id) {
      this.cuponAplicado = null;
    }
  }

  // Event binding (click): activa el cupón para la cotización (envío real: fase 2)
  aplicarEnCotizador(cupon: CuponPromocional): void {
    if (this.estadoEfectivo(cupon) === 'Expirado') {
      return;
    }
    this.cuponAplicado = cupon;
  }

  cerrarAviso(): void {
    this.cuponAplicado = null;
  }

  private crearBorrador(): BorradorCupon {
    return { codigo: '', campana: '', descuento: null, usosTotales: null, estado: 'Vigente' };
  }
}
