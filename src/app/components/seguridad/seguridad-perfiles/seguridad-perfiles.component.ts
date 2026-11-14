/* ==========================================================================
   ARCHIVO: seguridad-perfiles.component.ts
   FUNCIÓN: Módulo 1, sección "Perfiles": tabla de perfiles de 
            Al pulsar una fila navega a la ficha /seguridad/perfiles/:usuario.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-seguridad-perfiles',
  styleUrl: './seguridad-perfiles.component.css',
  templateUrl: './seguridad-perfiles.component.html',
})
export class SeguridadPerfilesComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Event binding (click / Enter): abre la ficha del perfil con un parámetro de ruta
  verPerfil(usuario: string): void {
    this.router.navigate(['/seguridad', 'perfiles', usuario]);
  }
}