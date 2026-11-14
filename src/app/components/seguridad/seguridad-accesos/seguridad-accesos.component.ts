/* ==========================================================================
   ARCHIVO: seguridad-accesos.component.ts
   FUNCIÓN: Módulo 1, sección "Registro de accesos": auditoría de intentos de
            ingreso (AuthService) con filtro en tiempo real.
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegistroAcceso } from '../../../services/auth.service';

export type ResultadoFiltro = 'Todos' | 'Concedido' | 'Denegado';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-seguridad-accesos',
  styleUrl: './seguridad-accesos.component.css',
  templateUrl: './seguridad-accesos.component.html',
})
export class SeguridadAccesosComponent {
  // Two-way binding de los filtros de la tabla de accesos
  filtroAccesos: string = '';
  filtroResultado: ResultadoFiltro = 'Todos';

  // MAQUETA (Delete): limpieza simulada del historial. Son signals (app sin zone.js).
  mensajeSimulacion = signal<string>('');
  confirmandoLimpieza = signal<boolean>(false);

  constructor(public authService: AuthService) {}

  // Filtro en tiempo real del registro de accesos: por nombre de usuario y por resultado
  accesosFiltrados(): RegistroAcceso[] {
    const texto = this.filtroAccesos.trim().toLowerCase();
    return this.authService.registroAccesos().filter(
      (acceso) =>
        (texto === '' || acceso.usuario.toLowerCase().includes(texto)) &&
        (this.filtroResultado === 'Todos' || (this.filtroResultado === 'Concedido') === acceso.exitoso)
    );
  }

  // ---- Limpieza del historial en maqueta (no borra nada) ----
  pedirLimpieza(): void {
    this.mensajeSimulacion.set('');
    this.confirmandoLimpieza.set(true);
  }

  cancelarLimpieza(): void {
    this.confirmandoLimpieza.set(false);
  }

  confirmarLimpieza(): void {
    this.confirmandoLimpieza.set(false);
    const total = this.authService.registroAccesos().length;
    this.mensajeSimulacion.set(
      `Maqueta: se eliminarían ${total} registros del historial de accesos. No se borró nada.`
    );
  }
}