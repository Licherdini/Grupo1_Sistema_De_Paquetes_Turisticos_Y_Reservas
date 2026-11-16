/* ==========================================================================
   ARCHIVO: proveedores-edit-dialog.component.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Diálogo modal (MatDialog) sobrepuesto con estilo vidrio para MODIFICAR
            los datos de un convenio con aerolínea o transporte terrestre.
            Recupera la información del proveedor, valida y devuelve los cambios.
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
import {
  ConvenioProveedor,
  TipoProveedor,
  EstadoConvenio
} from '../../../services/proveedores.service';

export interface DialogDataProveedor {
  proveedor: ConvenioProveedor;
}

@Component({
  selector: 'app-proveedores-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './proveedores-edit-dialog.component.html',
  styleUrl: './proveedores-edit-dialog.component.css'
})
export class ProveedoresEditDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<ProveedoresEditDialogComponent, ConvenioProveedor | null>>(MatDialogRef);
  public readonly data: DialogDataProveedor = inject(MAT_DIALOG_DATA);

  readonly tiposProveedor: TipoProveedor[] = ['Aerolínea', 'Transporte Terrestre'];
  readonly estadosConvenio: EstadoConvenio[] = ['Activo', 'Suspendido', 'En Renovación'];
  readonly unidades: Array<'por trayecto' | 'por persona'> = ['por trayecto', 'por persona'];
  readonly ciudadesDestino: string[] = [
    'Galápagos', 'Cuenca', 'Baños', 'Manta', 'Loja',
    'Esmeraldas', 'Ambato', 'Quito', 'Guayaquil', 'Montañita'
  ];

  // Recupera la información de la fila y crea una copia de edición (borrador)
  public borrador: ConvenioProveedor = { ...this.data.proveedor };

  get formularioValido(): boolean {
    return (
      this.borrador.nombre.trim().length >= 4 &&
      this.borrador.tarifaCorporativa > 0 &&
      this.borrador.frecuencias.trim().length > 0
    );
  }

  guardar(): void {
    if (!this.formularioValido) return;

    // Recalcula iniciales por si cambió el nombre comercial
    this.borrador.logoIniciales = this.borrador.nombre
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    this.dialogRef.close(this.borrador);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
