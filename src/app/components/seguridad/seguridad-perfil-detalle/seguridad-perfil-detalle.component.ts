/* ==========================================================================
   ARCHIVO: seguridad-perfil-detalle.component.ts
   FUNCIÓN: Ficha de un perfil. Los intentos se calculan con su registro de accesos.
            No se muestra la clave del perfil.
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, PerfilUsuario, RegistroAcceso } from '../../../services/auth.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-seguridad-perfil-detalle',
  templateUrl: './seguridad-perfil-detalle.component.html',
})
export class SeguridadPerfilDetalleComponent {
  usuario: string;
  perfil: PerfilUsuario | undefined;

  // MAQUETA: resultado simulado de las acciones (no modifica AuthService).
  // Son signals porque la app no usa zone.js.
  mensajeSimulacion = signal<string>('');
  confirmandoBaja = signal<boolean>(false);

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

  // ---- Acciones en maqueta (Update y Delete) ----
  reiniciarIntentos(): void {
    this.confirmandoBaja.set(false);
    this.mensajeSimulacion.set(
      `Maqueta: se reiniciarían a 0 los intentos fallidos de "${this.usuario}". No se modificó nada.`
    );
  }

  cambiarEstado(): void {
    this.confirmandoBaja.set(false);
    const cambio = this.perfil?.activo ? 'de Activo a Bloqueado' : 'de Inactivo a Activo';
    this.mensajeSimulacion.set(
      `Maqueta: la cuenta de "${this.usuario}" cambiaría ${cambio}. No se modificó nada.`
    );
  }

  pedirBaja(): void {
    this.mensajeSimulacion.set('');
    this.confirmandoBaja.set(true);
  }

  cancelarBaja(): void {
    this.confirmandoBaja.set(false);
  }

  confirmarBaja(): void {
    this.confirmandoBaja.set(false);
    this.mensajeSimulacion.set(
      `Maqueta: se daría de baja el perfil "${this.usuario}". No se eliminó nada.`
    );
  }
}