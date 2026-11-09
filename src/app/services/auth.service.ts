/* ==========================================================================
   ARCHIVO: src/app/services/auth.service.ts
   TEORÍA DEL CURSO: Servicio con @Injectable() para compartir datos y lógica
                     de forma global entre componentes (Diapositivas 16 y 17).
   ========================================================================== */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Variables públicas con las credenciales válidas para la validación interna
  public usuarioValido: string = 'admin';
  public claveValida: string = '12345';

  // 2. Variables públicas globales para controlar el Toolbar (Header)
  public estaLogueado: boolean = false;
  public usuarioActual: string = '';

  constructor() { }

  /**
   * Valida internamente las credenciales ingresadas contra las variables públicas
   */
  validarAcceso(usuarioIngresado: string, claveIngresada: string): boolean {
    if (
      usuarioIngresado.trim() === this.usuarioValido &&
      claveIngresada.trim() === this.claveValida
    ) {
      this.estaLogueado = true;
      this.usuarioActual = usuarioIngresado.trim();
      return true;
    } else {
      this.estaLogueado = false;
      this.usuarioActual = '';
      return false;
    }
  }

  /**
   * Cierra la sesión activa y limpia las variables globales
   */
  cerrarSesion(): void {
    this.estaLogueado = false;
    this.usuarioActual = '';
  }
}