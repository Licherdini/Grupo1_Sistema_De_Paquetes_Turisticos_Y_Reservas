import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconoComponent } from '../compartido/icono/icono.component';
import { CatalogoEditDialogComponent } from './catalogo-edit-dialog/catalogo-edit-dialog.component';
import { ConfirmacionDialogoComponent } from '../compartido/confirmacion-dialogo/confirmacion-dialogo.component';
import {
  CatalogoService,
  EstadoCupos,
  PaqueteTuristico,
  REGIONES,
  RegionEcuador
} from '../../services/catalogo.service';

export type VistaCatalogo = 'lista' | 'itinerario';

@Component({
  selector: 'app-modulo-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, IconoComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class ModuloCatalogoComponent {
  private readonly dialog = inject(MatDialog);
  private readonly catalogo = inject(CatalogoService);

  readonly regiones: RegionEcuador[] = REGIONES;
  readonly paquetes = this.catalogo.paquetes;

  readonly vista = signal<VistaCatalogo>('lista');
  readonly paqueteActivo = signal<PaqueteTuristico | null>(null);
  readonly mensajeNotificacion = signal<string>('');

  textoBusqueda: string = '';
  regionFiltro: RegionEcuador | 'Todas' = 'Todas';

  paquetesFiltrados(): PaqueteTuristico[] {
    const texto = this.textoBusqueda.trim().toLowerCase();
    return this.paquetes().filter((paquete) => {
      const coincideRegion = this.regionFiltro === 'Todas' || paquete.region === this.regionFiltro;
      const coincideTexto =
        texto === '' ||
        paquete.nombre.toLowerCase().includes(texto) ||
        paquete.destino.toLowerCase().includes(texto);
      return coincideRegion && coincideTexto;
    });
  }

  totalCuposDisponibles(): number {
    return this.paquetes().reduce((acum, item) => acum + item.cuposDisponibles, 0);
  }

  totalRegiones(): number {
    return new Set(this.paquetes().map((item) => item.region)).size;
  }

  paquetesAgotados(): number {
    return this.paquetes().filter((item) => item.cuposDisponibles <= 0).length;
  }

  estado(paquete: PaqueteTuristico): EstadoCupos {
    if (paquete.cuposDisponibles <= 0) {
      return 'Agotado';
    }
    return paquete.cuposDisponibles <= 5 ? 'Últimos cupos' : 'Disponible';
  }

  porcentajeOcupacion(paquete: PaqueteTuristico): number {
    if (paquete.cuposTotales <= 0) {
      return 0;
    }
    const ocupados = paquete.cuposTotales - paquete.cuposDisponibles;
    return Math.min(100, Math.max(0, Math.round((ocupados / paquete.cuposTotales) * 100)));
  }

  claseRegion(region: RegionEcuador): string {
    return region === 'Amazonía' ? 'region-amazonia' : `region-${region.toLowerCase()}`;
  }

  volverALista(): void {
    this.vista.set('lista');
    this.paqueteActivo.set(null);
  }

  verItinerario(paquete: PaqueteTuristico): void {
    this.paqueteActivo.set(paquete);
    this.vista.set('itinerario');
  }

  abrirNuevo(): void {
    this.abrirDialogo(null);
  }

  abrirEdicion(paquete: PaqueteTuristico): void {
    this.abrirDialogo(paquete);
  }

  solicitarEliminar(paquete: PaqueteTuristico): void {
    this.dialog
      .open(ConfirmacionDialogoComponent, {
        data: {
          titulo: 'Eliminar paquete turístico',
          mensaje: `Se eliminará el paquete "${paquete.nombre}" (${paquete.destino}) del catálogo. Esta acción no se puede deshacer. ¿Deseas continuar?`,
          tipo: 'peligro',
          textoConfirmar: 'Sí, eliminar paquete'
        },
        panelClass: 'dialogo-vidrio'
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.catalogo.eliminar(paquete.id);
          this.mostrarNotificacion(`Paquete "${paquete.nombre}" eliminado correctamente.`);
        }
      });
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.regionFiltro = 'Todas';
  }

  private abrirDialogo(paquete: PaqueteTuristico | null): void {
    const ref = this.dialog.open(CatalogoEditDialogComponent, {
      data: { paquete },
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    ref.afterClosed().subscribe((resultado: PaqueteTuristico | null) => {
      if (!resultado) {
        return;
      }
      if (paquete) {
        this.catalogo.actualizar(resultado);
        this.mostrarNotificacion(`Paquete "${resultado.nombre}" actualizado correctamente.`);
      } else {
        this.catalogo.crear(resultado);
        this.mostrarNotificacion(`Paquete "${resultado.nombre}" registrado correctamente.`);
      }
    });
  }

  private mostrarNotificacion(mensaje: string): void {
    this.mensajeNotificacion.set(mensaje);
    setTimeout(() => this.mensajeNotificacion.set(''), 4000);
  }
}