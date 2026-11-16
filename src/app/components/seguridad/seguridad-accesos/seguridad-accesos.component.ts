/* ==========================================================================
   ARCHIVO: seguridad-accesos.component.ts
   FUNCIÓN: Módulo 1, sección "Registro de accesos": auditoría de intentos de
            ingreso (AuthService) con filtro en tiempo real. "Limpiar historial"
            (solo Administrador) vacía el registro previa confirmación.
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthService, RegistroAcceso } from '../../../services/auth.service';
import { IconoComponent } from '../../compartido/icono/icono.component';
import {
  ConfirmacionDialogoComponent,
  DatosConfirmacion
} from '../../compartido/confirmacion-dialogo/confirmacion-dialogo.component';

export type ResultadoFiltro = 'Todos' | 'Concedido' | 'Denegado';

@Component({
  imports: [CommonModule, FormsModule, IconoComponent],
  selector: 'app-seguridad-accesos',
  styleUrl: './seguridad-accesos.component.css',
  templateUrl: './seguridad-accesos.component.html',
})
export class SeguridadAccesosComponent {
  // Two-way binding de los filtros de la tabla de accesos
  filtroAccesos: string = '';
  filtroResultado: ResultadoFiltro = 'Todos';

  // Mensaje de resultado (signal: la app no usa zone.js)
  mensajeNotificacion = signal<string>('');

  constructor(
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  // Filtro en tiempo real del registro de accesos: por nombre de usuario y por resultado
  accesosFiltrados(): RegistroAcceso[] {
    const texto = this.filtroAccesos.trim().toLowerCase();
    return this.authService.registroAccesos().filter(
      (acceso) =>
        (texto === '' || acceso.usuario.toLowerCase().includes(texto)) &&
        (this.filtroResultado === 'Todos' || (this.filtroResultado === 'Concedido') === acceso.exitoso)
    );
  }

  // Delete: pide confirmación en un diálogo y vacía TODO el historial (no solo lo filtrado)
  async limpiarHistorial(): Promise<void> {
    const total = this.authService.registroAccesos().length;
    if (!this.authService.esAdministrador() || total === 0) {
      return;
    }

    const confirmado = await firstValueFrom(
      this.dialog
        .open<ConfirmacionDialogoComponent, DatosConfirmacion, boolean>(ConfirmacionDialogoComponent, {
          panelClass: 'dialogo-vidrio',
          data: {
            titulo: 'Limpiar historial de accesos',
            mensaje:
              `Se eliminarán los ${total} registros del historial de TODOS los usuarios, ` +
              'incluso si hay un filtro aplicado. Esta acción no se puede deshacer. ¿Deseas continuar?',
            tipo: 'peligro',
            textoConfirmar: 'Sí, limpiar historial'
          }
        })
        .afterClosed()
    );

    if (confirmado === true) {
      const eliminados = this.authService.limpiarAccesos();
      if (eliminados !== null) {
        this.mensajeNotificacion.set(`Se eliminaron ${eliminados} registros del historial de accesos.`);
        setTimeout(() => this.mensajeNotificacion.set(''), 4000);
      }
    }
  }
}