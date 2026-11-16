/* ==========================================================================
   ARCHIVO: hoteles-edit-dialog.component.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Diálogo modal sobrepuesto (MatDialog con panelClass 'dialogo-vidrio')
            para modificar un convenio hotelero aliado.
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
  ConvenioHotel,
  CategoriaHotel,
  RegimenAlimentacion,
  EstadoConvenioHotel
} from '../proveedores-hoteles/proveedores-hoteles.component';

export interface DialogDataHotel {
  hotel: ConvenioHotel;
}

@Component({
  selector: 'app-hoteles-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './hoteles-edit-dialog.component.html',
  styleUrl: './hoteles-edit-dialog.component.css'
})
export class HotelesEditDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<HotelesEditDialogComponent, ConvenioHotel | null>>(MatDialogRef);
  public readonly data: DialogDataHotel = inject(MAT_DIALOG_DATA);

  readonly categorias: CategoriaHotel[] = ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
  readonly regimenes: RegimenAlimentacion[] = [
    'Solo alojamiento',
    'Desayuno incluido',
    'Todo incluido'
  ];
  readonly estadosConvenio: EstadoConvenioHotel[] = ['Activo', 'Suspendido', 'En Renovación'];
  readonly ciudadesDestino: string[] = [
    'Galápagos', 'Cuenca', 'Baños', 'Manta', 'Loja',
    'Esmeraldas', 'Ambato', 'Quito', 'Guayaquil', 'Montañita'
  ];

  // Copia local para editar sin mutar el original antes de guardar
  public borrador: ConvenioHotel = { ...this.data.hotel };

  get formularioValido(): boolean {
    return (
      this.borrador.nombreHotel.trim().length >= 4 &&
      this.borrador.cadena.trim().length >= 2 &&
      this.borrador.tarifaNoche > 0
    );
  }

  guardar(): void {
    if (!this.formularioValido) return;
    this.dialogRef.close(this.borrador);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
