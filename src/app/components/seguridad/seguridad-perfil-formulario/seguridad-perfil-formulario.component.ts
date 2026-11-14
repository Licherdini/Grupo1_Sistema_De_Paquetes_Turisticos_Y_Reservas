/* ==========================================================================
   ARCHIVO: seguridad-perfil-formulario.component.ts
   FUNCIÓN: MAQUETA del formulario de perfiles del Módulo 1.
            "Guardar" solo muestra el resultado simulado: no modifica
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, RolUsuario } from '../../../services/auth.service';

type EstadoCuenta = 'Activo' | 'Bloqueado' | 'Inactivo';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-seguridad-perfil-formulario',
  templateUrl: './seguridad-perfil-formulario.component.html',
})
export class SeguridadPerfilFormularioComponent {
  modo: 'crear' | 'editar';
  perfilNoEncontrado: boolean = false;

  // Campos del formulario
  usuario: string = '';
  nombreCompleto: string = '';
  rol: RolUsuario = 'Agente de viajes';
  estado: EstadoCuenta = 'Activo';
  clave: string = '';
  mostrarClave: boolean = false;   // controla [type] de la caja de clave

  readonly roles: RolUsuario[] = ['Administrador', 'Agente de viajes', 'Auditor'];
  readonly estados: EstadoCuenta[] = ['Activo', 'Bloqueado', 'Inactivo'];

  // Resultado simulado de "Guardar" 
  mensajeSimulacion = signal<string>('');

  constructor(route: ActivatedRoute, authService: AuthService) {
    this.modo = route.snapshot.data['modo'] === 'editar' ? 'editar' : 'crear';

    if (this.modo === 'editar') {
      // Parámetro de ruta :usuario -> se precargan los datos del perfil
      const usuarioUrl = route.snapshot.paramMap.get('usuario') ?? '';
      const perfil = authService.perfiles.find((p) => p.usuario === usuarioUrl);
      this.usuario = usuarioUrl;
      if (perfil) {
        this.nombreCompleto = perfil.nombreCompleto;
        this.rol = perfil.rol;
        this.estado = perfil.activo ? 'Activo' : 'Inactivo';
      } else {
        this.perfilNoEncontrado = true;
      }
    }
  }

  // A dónde regresa el enlace "Volver" / "Cancelar"
  get rutaVolver(): string[] {
    return this.modo === 'editar'
      ? ['/seguridad', 'perfiles', this.usuario]
      : ['/seguridad', 'perfiles'];
  }

  // al crear, usuario, nombre y clave son obligatorios
  get formularioValido(): boolean {
    const datosBasicos = this.usuario.trim() !== '' && this.nombreCompleto.trim() !== '';
    return this.modo === 'editar' ? datosBasicos : datosBasicos && this.clave.trim() !== '';
  }

  // Event solo simula el resultado
  guardar(): void {
    const accion = this.modo === 'crear' ? 'crearía' : 'actualizaría';
    this.mensajeSimulacion.set(
      `Maqueta: se ${accion} el perfil "${this.usuario.trim()}" con rol ${this.rol} y estado ${this.estado}. No se guardó nada.`
    );
  }
}