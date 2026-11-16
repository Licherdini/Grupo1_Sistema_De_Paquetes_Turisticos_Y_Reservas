/* ==========================================================================
   ARCHIVO: seguridad-perfil-detalle.component.ts
   FUNCIÓN: Ficha de un perfil. Los intentos se calculan con su registro de accesos.
            No se muestra la clave del perfil. Editar, bloquear/activar y dar de
            baja reutilizan los mismos diálogos que la tabla.
   ========================================================================== */

import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, RegistroAcceso } from '../../../services/auth.service';
import { PerfilesAccionesService } from '../../../services/perfiles-acciones.service';
import { IconoComponent } from '../../compartido/icono/icono.component';

@Component({
  imports: [CommonModule, RouterLink, IconoComponent],
  selector: 'app-seguridad-perfil-detalle',
  templateUrl: './seguridad-perfil-detalle.component.html',
})
export class SeguridadPerfilDetalleComponent {
  usuario: string;

  // Signal calculado: la ficha se actualiza sola cuando el perfil cambia en el servicio
  perfil = computed(() =>
    this.authService.perfilesVisibles().find((p) => p.usuario === this.usuario)
  );

  // Único elemento que sigue siendo maqueta: reiniciar intentos (se calculan del registro)
  mensajeSimulacion = signal<string>('');

  constructor(
    route: ActivatedRoute,
    public authService: AuthService,
    private acciones: PerfilesAccionesService,
    private router: Router
  ) {
    // El segmento :usuario de la URL llega como parámetro de ruta
    this.usuario = route.snapshot.paramMap.get('usuario') ?? '';
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

  // ---- Acciones reales (mismos diálogos que la tabla) ----
  editar(): void {
    const perfil = this.perfil();
    if (perfil) {
      this.acciones.modificar(perfil);
    }
  }

  cambiarEstado(): void {
    const perfil = this.perfil();
    if (perfil) {
      this.acciones.cambiarEstado(perfil);
    }
  }

  async darDeBaja(): Promise<void> {
    const perfil = this.perfil();
    if (perfil && (await this.acciones.eliminar(perfil))) {
      this.router.navigate(['/seguridad', 'perfiles']);
    }
  }

  // ---- Acción en maqueta ----
  reiniciarIntentos(): void {
    this.mensajeSimulacion.set(
      `Maqueta: se reiniciarían a 0 los intentos fallidos de "${this.usuario}". No se modificó nada.`
    );
  }
}