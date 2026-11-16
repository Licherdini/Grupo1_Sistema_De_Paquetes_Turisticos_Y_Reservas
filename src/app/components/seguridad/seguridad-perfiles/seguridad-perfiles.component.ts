/* ==========================================================================
   ARCHIVO: seguridad-perfiles.component.ts
   FUNCIÓN: Módulo 1, sección "Perfiles": tabla Material (MatTable) con filtro,
            botones Modificar / Eliminar por fila y alta de perfiles mediante
            diálogos. Los datos viven en AuthService (variables de servicio).
            Al pulsar una fila navega a la ficha /seguridad/perfiles/:usuario.
   ========================================================================== */

import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService, PerfilUsuario } from '../../../services/auth.service';
import { PerfilesAccionesService } from '../../../services/perfiles-acciones.service';
import { IconoComponent } from '../../compartido/icono/icono.component';

// Fila de la tabla: el perfil más una columna calculada desde el registro de accesos
export interface FilaPerfil extends PerfilUsuario {
  ultimoIngreso: Date | null;
}

@Component({
  imports: [CommonModule, FormsModule, MatTableModule, IconoComponent],
  selector: 'app-seguridad-perfiles',
  styleUrl: './seguridad-perfiles.component.css',
  templateUrl: './seguridad-perfiles.component.html',
})
export class SeguridadPerfilesComponent {
  readonly columnas: string[] = ['usuario', 'nombreCompleto', 'rol', 'estado', 'ultimoIngreso', 'acciones'];
  readonly dataSource = new MatTableDataSource<FilaPerfil>([]);

  // Two-way binding del input de filtrado
  textoFiltro: string = '';

  // Se recalcula sola cuando cambian los perfiles o el registro de accesos (signals)
  private filas = computed<FilaPerfil[]>(() => {
    const accesos = this.authService.registroAccesos();
    return this.authService.perfilesVisibles().map((perfil) => ({
      ...perfil,
      ultimoIngreso:
        accesos.find((acceso) => acceso.usuario === perfil.usuario && acceso.exitoso)?.fechaHora ?? null
    }));
  });

  constructor(
    public authService: AuthService,
    private router: Router,
    private acciones: PerfilesAccionesService
  ) {
    this.dataSource.filterPredicate = (fila, filtro) =>
      [fila.usuario, fila.nombreCompleto, fila.rol, fila.estado].join(' ').toLowerCase().includes(filtro);

    // Cada cambio del servicio actualiza los datos de la tabla
    effect(() => {
      this.dataSource.data = this.filas();
    });
  }

  // Identifica cada fila por su usuario: al editar o eliminar solo cambia esa fila
  // (sin esto Material vuelve a dibujar y a animar todas las filas)
  readonly rastrearPorUsuario = (_indice: number, fila: FilaPerfil): string => fila.usuario;

  aplicarFiltro(valor: string): void {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  limpiarFiltro(): void {
    this.textoFiltro = '';
    this.aplicarFiltro('');
  }

  totalPerfiles(): number {
    return this.authService.perfilesVisibles().length;
  }

  claseEstado(estado: string): string {
    if (estado === 'Activo') {
      return 'bg-success-subtle text-success-emphasis';
    }
    return estado === 'Bloqueado'
      ? 'bg-danger-subtle text-danger-emphasis'
      : 'bg-secondary-subtle text-secondary-emphasis';
  }

  // Event binding (click / Enter): abre la ficha del perfil con un parámetro de ruta
  verPerfil(usuario: string): void {
    this.router.navigate(['/seguridad', 'perfiles', usuario]);
  }

  nuevoPerfil(): void {
    this.acciones.crear();
  }

  modificar(perfil: PerfilUsuario): void {
    this.acciones.modificar(perfil);
  }

  eliminar(perfil: PerfilUsuario): void {
    this.acciones.eliminar(perfil);
  }
}