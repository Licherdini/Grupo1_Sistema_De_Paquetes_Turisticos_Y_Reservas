/* ==========================================================================
   ARCHIVO: facturacion-dialogo.component.ts
   FUNCIÓN: Módulo 5. Diálogo (MatDialog) para MODIFICAR una factura.
            Recibe la factura vía MAT_DIALOG_DATA y devuelve el objeto
            editado al cerrar con "Guardar".
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { Factura, EstadoPagoFactura } from '../../../services/facturacion.service';

@Component({
  selector: 'app-facturacion-dialogo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './facturacion-dialogo.component.html'
})
export class FacturacionDialogoComponent {
  private dialogRef = inject<MatDialogRef<FacturacionDialogoComponent, Factura | null>>(MatDialogRef);
  private datos = inject<Factura>(MAT_DIALOG_DATA);

  readonly estados: EstadoPagoFactura[] = ['Pagado', 'Pendiente', 'Anulado'];

  // Campos editables (two-way binding)
  cliente: string = this.datos.cliente;
  paqueteTuristico: string = this.datos.paqueteTuristico;
  montoTotal: number = this.datos.montoTotal;
  estadoPago: EstadoPagoFactura = this.datos.estadoPago;

  get formularioValido(): boolean {
    return (
      this.cliente.trim().length >= 3 &&
      this.paqueteTuristico.trim().length >= 3 &&
      this.montoTotal > 0
    );
  }

  guardar(): void {
    if (!this.formularioValido) {
      return;
    }
    this.dialogRef.close({
      ...this.datos,
      cliente: this.cliente.trim(),
      paqueteTuristico: this.paqueteTuristico.trim(),
      montoTotal: this.montoTotal,
      estadoPago: this.estadoPago
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
