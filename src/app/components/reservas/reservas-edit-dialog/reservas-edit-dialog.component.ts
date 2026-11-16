/* ==========================================================================
   ARCHIVO: src/app/components/reservas/reservas-edit-dialog/reservas-edit-dialog.component.ts
   MÓDULO 4: Cotizaciones y Reservas (Kenny Ormaza Padilla)
   FUNCIÓN: Diálogo modal (MatDialog) sobrepuesto estilo vidrio para MODIFICAR
            los datos de una reserva turística (igual que Módulo 3 y Módulo 1).
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { PaqueteCotizable, PreReserva, ReservasService } from '../../../services/reservas.service';

export interface DialogDataReserva {
  reserva: PreReserva;
}

@Component({
  selector: 'app-reservas-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './reservas-edit-dialog.component.html',
  styleUrl: './reservas-edit-dialog.component.css'
})
export class ReservasEditDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<ReservasEditDialogComponent, PreReserva | null>>(MatDialogRef);
  public readonly data: DialogDataReserva = inject(MAT_DIALOG_DATA);
  public readonly reservasService = inject(ReservasService);

  readonly temporadas: Array<'Baja' | 'Media' | 'Alta'> = ['Baja', 'Media', 'Alta'];
  readonly estados: Array<'Confirmada' | 'Pendiente' | 'Modificada'> = ['Confirmada', 'Pendiente', 'Modificada'];

  // Copia de edición (borrador) con los datos actuales
  public borrador: PreReserva = { ...this.data.reserva };

  get paquetes(): PaqueteCotizable[] {
    return this.reservasService.paquetes();
  }

  get paqueteActual(): PaqueteCotizable | undefined {
    return this.paquetes.find((p) => p.id === this.borrador.paqueteId);
  }

  onPaqueteChange(): void {
    const pkg = this.paqueteActual;
    if (pkg) {
      this.borrador.paqueteNombre = pkg.nombre;
      this.borrador.region = pkg.region;
      this.recalcularTotal();
    }
  }

  obtenerFactorTemporada(): number {
    if (this.borrador.temporada === 'Baja') return 0.9;
    if (this.borrador.temporada === 'Alta') return 1.2;
    return 1.0;
  }

  recalcularTotal(): void {
    const pkg = this.paqueteActual;
    if (!pkg) return;
    const pax = Math.max(1, Number(this.borrador.pasajeros) || 1);
    this.borrador.total = Math.round(pkg.precioBase * pax * this.obtenerFactorTemporada());
  }

  get formularioValido(): boolean {
    return (
      this.borrador.cliente.trim().length >= 3 &&
      this.borrador.fechaSalida.trim().length > 0 &&
      this.borrador.pasajeros >= 1 &&
      this.borrador.pasajeros <= 20
    );
  }

  guardar(): void {
    if (!this.formularioValido) return;
    this.recalcularTotal();
    this.borrador.cliente = this.borrador.cliente.trim().toUpperCase();
    this.dialogRef.close(this.borrador);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
