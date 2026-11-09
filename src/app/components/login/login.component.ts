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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Propiedades vinculadas con Two-way binding [(ngModel)]
  usuario: string = '';
  clave: string = '';
  mostrarClave: boolean = false;

  // Control de mensajes en pantalla
  mensajeEstado: string = '';
  esAccesoConcedido: boolean = false;

  // Inyección del Servicio global y del Router para redireccionar
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  validarCredenciales(): void {
    // 1. Validar si dejó campos vacíos
    if (this.usuario.trim() === '' || this.clave.trim() === '') {
      this.esAccesoConcedido = false;
      this.mensajeEstado = 'Error en credenciales: Debe ingresar usuario y clave.';
      alert('Error en credenciales: Debe ingresar usuario y clave.');
      return;
    }

    // 2. Validar contra las variables públicas de AuthService
    const accesoCorrecto = this.authService.validarAcceso(this.usuario, this.clave);

    if (accesoCorrecto) {
      this.esAccesoConcedido = true;
      this.mensajeEstado = '¡Acceso concedido! Redirigiendo a AndesTravel UG...';
      alert('Acceso concedido');
      // Redirección a la página principal de la propuesta
      this.router.navigate(['/principal']);
    } else {
      this.esAccesoConcedido = false;
      this.mensajeEstado = 'Error en credenciales: Usuario o clave incorrectos.';
      alert('Error en credenciales');
    }
  }

  /**
   * FUNCIÓN: limpiarError()
   * Quita el borde rojo y el mensaje de error apenas el usuario empieza a escribir.
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