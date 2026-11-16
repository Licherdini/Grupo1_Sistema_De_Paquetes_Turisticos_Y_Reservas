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
  PaqueteTuristico,
  REGIONES,
  RegionEcuador,
  crearPaqueteVacio
} from '../../../services/catalogo.service';

export interface DialogDataPaquete {
  paquete: PaqueteTuristico | null;
}

@Component({
  selector: 'app-catalogo-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, IconoComponent],
  templateUrl: './catalogo-edit-dialog.component.html',
  styleUrl: './catalogo-edit-dialog.component.css'
})
export class CatalogoEditDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<CatalogoEditDialogComponent, PaqueteTuristico | null>>(MatDialogRef);
  public readonly data: DialogDataPaquete = inject(MAT_DIALOG_DATA);

  readonly regiones: RegionEcuador[] = REGIONES;
  readonly modo: 'crear' | 'editar' = this.data.paquete ? 'editar' : 'crear';

  public borrador: PaqueteTuristico = this.data.paquete
    ? structuredClone(this.data.paquete)
    : crearPaqueteVacio();
  public nuevoServicio: string = '';

  get formularioValido(): boolean {
    const p = this.borrador;
    return (
      (p.nombre?.trim().length ?? 0) >= 3 &&
      (p.destino?.trim().length ?? 0) >= 2 &&
      Number(p.tarifaBaja) > 0 &&
      Number(p.tarifaAlta) >= Number(p.tarifaBaja) &&
      Number(p.cuposTotales) >= 1 &&
      Number(p.cuposDisponibles) >= 0 &&
      Number(p.cuposDisponibles) <= Number(p.cuposTotales)
    );
  }

  cambiarDuracion(dias: number): void {
    const cantidad = Math.min(15, Math.max(1, Math.floor(Number(dias) || 1)));
    this.borrador.duracionDias = cantidad;
    while (this.borrador.itinerario.length < cantidad) {
      this.borrador.itinerario.push({ titulo: `Día ${this.borrador.itinerario.length + 1}`, actividades: '' });
    }
    this.borrador.itinerario.length = cantidad;
  }

  agregarServicio(): void {
    const servicio = this.nuevoServicio.trim();
    if (servicio === '' || this.borrador.servicios.includes(servicio)) {
      return;
    }
    this.borrador.servicios.push(servicio);
    this.nuevoServicio = '';
  }

  quitarServicio(indice: number): void {
    this.borrador.servicios.splice(indice, 1);
  }

  guardar(): void {
    if (!this.formularioValido) {
      return;
    }
    this.borrador.nombre = this.borrador.nombre.trim();
    this.borrador.destino = this.borrador.destino.trim();
    this.borrador.itinerario.forEach((dia, indice) => {
      if (!dia.titulo.trim()) {
        dia.titulo = `Día ${indice + 1}`;
      }
    });
    this.dialogRef.close(this.borrador);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}