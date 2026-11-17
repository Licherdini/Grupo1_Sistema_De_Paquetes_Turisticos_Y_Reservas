/* ==========================================================================
   ARCHIVO: cupon-edit-dialog.component.ts
   MÓDULO 6: Promociones y Cupones (Matews Abrahan Narvaez Cabeza)
   FUNCIÓN: Componente Diálogo Modal (MatDialog) para recuperar y modificar
            la información de un cupón de descuento, o registrar uno nuevo.
            Cumple con el Requisito 3 del deber (Componente de Dialog).
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
import { IconoComponent } from '../../compartido/icono/icono.component';
import {
  CuponPromocional,
  EstadoCupon,
  PromocionesService
} from '../../../services/promociones.service';

export interface DialogDataCupon {
  cupon: CuponPromocional | null;
}

@Component({
  selector: 'app-cupon-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, IconoComponent],
  templateUrl: './cupon-edit-dialog.component.html',
  styleUrl: './cupon-edit-dialog.component.css'
})
export class CuponEditDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<CuponEditDialogComponent, CuponPromocional | null>>(MatDialogRef);
  public readonly data: DialogDataCupon = inject(MAT_DIALOG_DATA);
  public readonly promocionesService = inject(PromocionesService);

  readonly modo: 'crear' | 'editar' = this.data.cupon ? 'editar' : 'crear';
  readonly descuentoMinimo: number = 5;
  readonly descuentoMaximo: number = 70;
  readonly estados: EstadoCupon[] = ['Vigente', 'Expirado'];

  // Copia de edición (borrador reactivo)
  public borrador: CuponPromocional = this.data.cupon
    ? { ...this.data.cupon }
    : {
        id: 0,
        codigo: '',
        campana: '',
        descuento: 15,
        usosTotales: 50,
        usosDisponibles: 50,
        estado: 'Vigente'
      };

  get codigoNormalizado(): string {
    return (this.borrador.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  get codigoDuplicado(): boolean {
    const cod = this.codigoNormalizado;
    if (!cod) return false;
    return this.promocionesService
      .cupones()
      .some((c) => c.codigo.toUpperCase() === cod && c.id !== this.borrador.id);
  }

  get formularioValido(): boolean {
    const cod = this.codigoNormalizado;
    const desc = Number(this.borrador.descuento);
    const totales = Number(this.borrador.usosTotales);
    const disponibles = Number(this.borrador.usosDisponibles);

    return (
      cod.length >= 3 &&
      !this.codigoDuplicado &&
      this.borrador.campana.trim().length >= 3 &&
      desc >= this.descuentoMinimo &&
      desc <= this.descuentoMaximo &&
      Number.isInteger(totales) &&
      totales >= 1 &&
      Number.isInteger(disponibles) &&
      disponibles >= 0 &&
      disponibles <= totales
    );
  }

  onTotalesChange(nuevoTotal: number): void {
    const totalNum = Number(nuevoTotal) || 0;
    if (this.modo === 'crear') {
      this.borrador.usosDisponibles = totalNum;
    } else if (this.data.cupon) {
      const diferencia = totalNum - this.data.cupon.usosTotales;
      this.borrador.usosDisponibles = Math.min(
        totalNum,
        Math.max(0, this.data.cupon.usosDisponibles + diferencia)
      );
    }
  }

  guardar(): void {
    if (!this.formularioValido) return;

    this.borrador.codigo = this.codigoNormalizado;
    this.borrador.campana = this.borrador.campana.trim();
    this.borrador.descuento = Number(this.borrador.descuento);
    this.borrador.usosTotales = Number(this.borrador.usosTotales);
    this.borrador.usosDisponibles = Number(this.borrador.usosDisponibles);

    if (this.borrador.usosDisponibles <= 0) {
      this.borrador.estado = 'Expirado';
    }

    this.dialogRef.close(this.borrador);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
