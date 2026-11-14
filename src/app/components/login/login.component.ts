/* ==========================================================================
   ARCHIVO: src/app/components/login/login.component.ts
   FUNCIÓN: Valida internamente el usuario y clave usando AuthService,
            muestra el mensaje correspondiente y redirige a /principal.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProyectoInfoService } from '../../services/proyecto-info.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  clave: string = '';
  mostrarClave: boolean = false;

  // Control de mensajes en pantalla 
  mensajeEstado: string = '';
  esAccesoConcedido: boolean = false;

  // Inyección de los servicios globales y del Router para redireccionar
  constructor(
    public authService: AuthService,
    public proyectoInfo: ProyectoInfoService,
    private router: Router
  ) {}
  
  validarCredenciales(): void {
    // Evita envíos repetidos mientras se muestra "Acceso concedido"
    if (this.esAccesoConcedido) {
      return;
    }

    // 1. Validar si dejó campos vacíos
    if (this.usuario.trim() === '' || this.clave.trim() === '') {
      this.esAccesoConcedido = false;
      this.mensajeEstado = 'Error en credenciales: Debe ingresar usuario y clave.';
      return;
    }

    // 2. Validar contra las variables públicas de AuthService (sin iniciar sesión aún)
    const accesoCorrecto = this.authService.credencialesValidas(this.usuario, this.clave);

   // Auditoría (Módulo 1): deja constancia del intento, sea exitoso o fallido
    this.authService.registrarAcceso(this.usuario, accesoCorrecto);

    if (accesoCorrecto) {
      this.esAccesoConcedido = true;
      this.mensajeEstado = '¡Acceso concedido! Redirigiendo a AndesTravel UG...';
      // Pausa breve para leer el mensaje. La sesión se activa justo antes de navegar
      setTimeout(() => {
        this.authService.iniciarSesion(this.usuario);
        this.router.navigate(['/principal']);
      }, 1000);
    } else {
      this.esAccesoConcedido = false;
      this.mensajeEstado = 'Error en credenciales: Usuario o clave incorrectos.';
    }
  }

  /**
   * Quita el mensaje de error apenas el usuario empieza a escribir.
   */
  limpiarError(): void {
    if (!this.esAccesoConcedido && this.mensajeEstado) {
      this.mensajeEstado = '';
    }
  }

  alternarVistaClave(): void {
    this.mostrarClave = !this.mostrarClave;
  }
}