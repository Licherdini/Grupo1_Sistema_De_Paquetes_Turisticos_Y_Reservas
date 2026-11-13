/* ==========================================================================
   ARCHIVO: seguridad-accesos.component.ts
   FUNCIÓN: Módulo 1, sección "Registro de accesos": auditoría de intentos de
            ingreso (AuthService) con filtro en tiempo real.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegistroAcceso } from '../../../services/auth.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-seguridad-accesos',
  styleUrl: './seguridad-accesos.component.css',
  templateUrl: './seguridad-accesos.component.html',
})
export class SeguridadAccesosComponent {
  // Two-way binding del filtro de la tabla de accesos
  filtroAccesos: string = '';

  constructor(public authService: AuthService) {}

  // Filtro en tiempo real del registro de accesos: por usuario o por resultado
  accesosFiltrados(): RegistroAcceso[] {
    const texto = this.filtroAccesos.trim().toLowerCase();
    const accesos = this.authService.registroAccesos();
    if (texto === '') {
      return accesos;
    }
    return accesos.filter(
      (acceso) =>
        acceso.usuario.toLowerCase().includes(texto) ||
        (acceso.exitoso ? 'exitoso' : 'fallido').includes(texto)
    );
  }
}