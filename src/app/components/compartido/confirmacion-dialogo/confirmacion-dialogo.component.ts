/* ==========================================================================
   ARCHIVO: src/app/components/compartido/confirmacion-dialogo/confirmacion-dialogo.component.ts
   FUNCIÓN: Diálogo de confirmación reutilizable (advertencia, peligro,
            información o éxito) para cualquier módulo. Devuelve true/false
            con MatDialogRef al cerrarse.
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { IconoComponent, NombreIcono } from '../icono/icono.component';

export type TipoConfirmacion = 'advertencia' | 'peligro' | 'informacion' | 'exito';

export interface DatosConfirmacion {
  titulo: string;
  mensaje: string;
  tipo?: TipoConfirmacion;
  textoConfirmar?: string;
  // undefined = "Cancelar"; null = no se muestra el botón (diálogo solo informativo)
  textoCancelar?: string | null;
}

@Component({
  selector: 'app-confirmacion-dialogo',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, IconoComponent],
  templateUrl: './confirmacion-dialogo.component.html',
  styleUrl: './confirmacion-dialogo.component.css'
})
export class ConfirmacionDialogoComponent {
  // Los datos llegan desde quien abre el diálogo (MAT_DIALOG_DATA)
  datos = inject<DatosConfirmacion>(MAT_DIALOG_DATA);

  get tipo(): TipoConfirmacion {
    return this.datos.tipo ?? 'advertencia';
  }

  // Nombre del icono SVG según el tipo (ver IconoComponent)
  get icono(): NombreIcono {
    const iconos: Record<TipoConfirmacion, NombreIcono> = {
      advertencia: 'advertencia',
      peligro: 'papelera',
      informacion: 'informacion',
      exito: 'exito'
    };
    return iconos[this.tipo];
  }

  get claseBotonConfirmar(): string {
    return this.tipo === 'peligro' ? 'btn-danger' : 'btn-dark';
  }
}