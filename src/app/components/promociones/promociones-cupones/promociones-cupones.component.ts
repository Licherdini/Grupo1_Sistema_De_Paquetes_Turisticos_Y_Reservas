/* ==========================================================================
   ARCHIVO: promociones-cupones.component.ts
   MÓDULO 6: Promociones y Cupones (Matews Abrahan Narvaez Cabeza).
   FUNCIÓN: Gestión de Cupones de Descuento (/promociones/cupones).
            Implementa CRUD completo mediante variables de servicio reactivas (Signals),
            tabla interactiva de 6 columnas con filtros y Angular Material Dialog
            para la recuperación y edición de datos (Requisitos 1, 2, 3 y 4).
   ========================================================================== */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { IconoComponent } from '../../compartido/icono/icono.component';
import {
  ConfirmacionDialogoComponent,
  DatosConfirmacion
} from '../../compartido/confirmacion-dialogo/confirmacion-dialogo.component';
import {
  CuponPromocional,
  EstadoCupon,
  FiltroEstadoCupon,
  PromocionesService
} from '../../../services/promociones.service';
import { CuponEditDialogComponent } from '../cupon-edit-dialog/cupon-edit-dialog.component';

export interface BorradorCupon {
  codigo: string;
  campana: string;
  descuento: number | null;
  usosTotales: number | null;
  estado: EstadoCupon;
}

@Component({
  selector: 'app-promociones-cupones',
  standalone: true,
  imports: [CommonModule, FormsModule, IconoComponent],
  templateUrl: './promociones-cupones.component.html',
  styleUrl: './promociones-cupones.component.css'
})
export class PromocionesCuponesComponent {
  public promocionesService = inject(PromocionesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly descuentoMinimo: number = 5;
  readonly descuentoMaximo: number = 70;

  // Filtros reactivos en tiempo real (READ)
  textoBusqueda: string = '';
  estadoFiltro: FiltroEstadoCupon = 'Todos';

  // Cupón activado para cotización
  cuponAplicado: CuponPromocional | null = null;

  // Compatibilidad para creación/edición programática y pruebas
  borrador: BorradorCupon = this.crearBorrador();
  editandoId: number | null = null;

  constructor() {
    this.textoBusqueda = this.route.snapshot.queryParamMap.get('codigo') ?? '';
  }

  // Lista conectada a la variable del servicio
  get cupones(): CuponPromocional[] {
    return this.promocionesService.cupones();
  }

  set cupones(lista: CuponPromocional[]) {
    this.promocionesService.cupones.set(lista);
  }

  get mensajeNotificacion() {
    return this.promocionesService.mensajeNotificacion;
  }

  estadoEfectivo(cupon: CuponPromocional): EstadoCupon {
    return this.promocionesService.estadoEfectivo(cupon);
  }

  // Filtrado reactivo en tiempo real por texto (código o campaña) y por estado
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
    if (cupon.usosTotales <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((cupon.usosDisponibles / cupon.usosTotales) * 100)));
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.estadoFiltro = 'Todos';
  }

  // REQUISITO 3: Abrir diálogo modal con MatDialog para MODIFICAR los datos del cupón
  abrirDialogEdicion(cupon: CuponPromocional): void {
    const dialogRef = this.dialog.open(CuponEditDialogComponent, {
      data: { cupon },
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    dialogRef.afterClosed().subscribe((resultado: CuponPromocional | null) => {
      if (resultado) {
        this.promocionesService.actualizarCupon(cupon.id, resultado);
        if (this.cuponAplicado?.id === cupon.id && this.estadoEfectivo(resultado) === 'Expirado') {
          this.cuponAplicado = null;
        }
        this.snackBar.open(
          `Cupón "${resultado.codigo}" actualizado correctamente.`,
          'Cerrar',
          {
            duration: 3500,
            panelClass: ['snack-exito'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      }
    });
  }

  // Modal para CREAR un nuevo cupón
  abrirDialogCrear(): void {
    const dialogRef = this.dialog.open(CuponEditDialogComponent, {
      data: { cupon: null },
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    dialogRef.afterClosed().subscribe((resultado: CuponPromocional | null) => {
      if (resultado) {
        const creado = this.promocionesService.crearCupon({
          codigo: resultado.codigo,
          campana: resultado.campana,
          descuento: resultado.descuento,
          usosTotales: resultado.usosTotales,
          usosDisponibles: resultado.usosDisponibles,
          estado: resultado.estado
        });
        this.snackBar.open(
          `Cupón "${creado.codigo}" registrado exitosamente.`,
          'Cerrar',
          {
            duration: 3500,
            panelClass: ['snack-exito'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      }
    });
  }

  // REQUISITO 4: Botón Eliminar con confirmación modal reutilizable
  async eliminar(cupon: CuponPromocional): Promise<void> {
    const confirmado = await firstValueFrom(
      this.dialog
        .open<ConfirmacionDialogoComponent, DatosConfirmacion, boolean>(
          ConfirmacionDialogoComponent,
          {
            data: {
              titulo: 'Eliminar cupón promocional',
              mensaje: `¿Está seguro de eliminar el cupón "${cupon.codigo}" (${cupon.campana})? Se quitará definitivamente de la tabla.`,
              tipo: 'peligro',
              textoConfirmar: 'Sí, eliminar'
            },
            panelClass: 'dialogo-vidrio'
          }
        )
        .afterClosed()
    );

    if (confirmado === true) {
      this.promocionesService.eliminarCupon(cupon.id);
      if (this.cuponAplicado?.id === cupon.id) {
        this.cuponAplicado = null;
      }
      if (this.editandoId === cupon.id) {
        this.cancelarEdicion();
      }
      this.snackBar.open(`Cupón "${cupon.codigo}" eliminado de la tabla.`, 'Cerrar', {
        duration: 3500,
        panelClass: ['snack-exito'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  // Alternar rápidamente entre Vigente y Expirado
  alternarEstado(cupon: CuponPromocional): void {
    if (cupon.usosDisponibles <= 0) return;
    this.promocionesService.alternarEstado(cupon.id);
    if (this.cuponAplicado?.id === cupon.id && cupon.estado === 'Expirado') {
      this.cuponAplicado = null;
    }
  }

  // Aplicar en cotizador / módulo 4
  aplicarEnCotizador(cupon: CuponPromocional): void {
    if (this.estadoEfectivo(cupon) === 'Expirado') return;
    this.cuponAplicado = cupon;
  }

  cerrarAviso(): void {
    this.cuponAplicado = null;
  }

  // Métodos de apoyo y compatibilidad directa con pruebas existentes
  editar(cupon: CuponPromocional): void {
    this.abrirDialogEdicion(cupon);
  }

  codigoNormalizado(): string {
    return (this.borrador.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  codigoDuplicado(): boolean {
    const cod = this.codigoNormalizado();
    return (
      cod !== '' &&
      this.cupones.some((c) => c.codigo.toUpperCase() === cod && c.id !== this.editandoId)
    );
  }

  formularioValido(): boolean {
    const b = this.borrador;
    const desc = Number(b.descuento);
    const usos = Number(b.usosTotales);
    return (
      this.codigoNormalizado().length >= 3 &&
      !this.codigoDuplicado() &&
      b.campana.trim().length >= 3 &&
      desc >= this.descuentoMinimo &&
      desc <= this.descuentoMaximo &&
      Number.isInteger(usos) &&
      usos >= 1
    );
  }

  guardar(): void {
    if (!this.formularioValido()) return;
    const total = Number(this.borrador.usosTotales);

    if (this.editandoId === null) {
      this.promocionesService.crearCupon({
        codigo: this.codigoNormalizado(),
        campana: this.borrador.campana.trim(),
        descuento: Number(this.borrador.descuento),
        usosTotales: total,
        usosDisponibles: total,
        estado: this.borrador.estado
      });
    } else {
      const actual = this.cupones.find((c) => c.id === this.editandoId);
      if (actual) {
        const diferencia = total - actual.usosTotales;
        const nuevosDisponibles = Math.min(total, Math.max(0, actual.usosDisponibles + diferencia));
        this.promocionesService.actualizarCupon(actual.id, {
          codigo: this.codigoNormalizado(),
          campana: this.borrador.campana.trim(),
          descuento: Number(this.borrador.descuento),
          usosTotales: total,
          usosDisponibles: nuevosDisponibles,
          estado: this.borrador.estado
        });
      }
    }
    this.cancelarEdicion();
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.borrador = this.crearBorrador();
  }

  private crearBorrador(): BorradorCupon {
    return { codigo: '', campana: '', descuento: null, usosTotales: null, estado: 'Vigente' };
  }
}
