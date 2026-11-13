/* ==========================================================================
   ARCHIVO: seguridad-perfil-detalle.component.ts
   TEORÍA DEL CURSO: Parámetros de ruta con ActivatedRoute (Diapositivas 10 y 11).
   FUNCIÓN: Ficha de un perfil (/seguridad/perfiles/:usuario). Los datos salen de
            AuthService; los intentos se calculan con su registro de accesos.
            No se muestra la clave del perfil.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, PerfilUsuario, RegistroAcceso } from '../../../services/auth.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-seguridad-perfil-detalle',
  styleUrl: './seguridad-perfil-detalle.component.css',
  templateUrl: './seguridad-perfil-detalle.component.html',
})
export class SeguridadPerfilDetalleComponent {
  usuario: string;
  perfil: PerfilUsuario | undefined;

  constructor(
    route: ActivatedRoute,
    public authService: AuthService
  ) {
    // El segmento :usuario de la URL llega como parámetro de ruta
    this.usuario = route.snapshot.paramMap.get('usuario') ?? '';
    this.perfil = authService.perfiles.find((p) => p.usuario === this.usuario);
  }

  private accesosDelPerfil(): RegistroAcceso[] {
    return this.authService.registroAccesos().filter((a) => a.usuario === this.usuario);
  }

  ingresosExitosos(): number {
    return this.accesosDelPerfil().filter((a) => a.exitoso).length;
  }

  intentosFallidos(): number {
    return this.accesosDelPerfil().filter((a) => !a.exitoso).length;
  }

  // El registro guarda el más reciente primero
  ultimoIngreso(): Date | undefined {
    return this.accesosDelPerfil().find((a) => a.exitoso)?.fechaHora;
  }
}