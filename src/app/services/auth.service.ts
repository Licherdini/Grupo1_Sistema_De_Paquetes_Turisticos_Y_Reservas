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

  // 2. Variables públicas globales que controlan el Toolbar (Header)
  public estaLogueado: boolean = false;
  public usuarioActual: string = '';

  constructor() { }

  /**
   * Solo COMPARA las credenciales ingresadas con las variables públicas.
   * No modifica el estado de la sesión.
   */
  credencialesValidas(usuarioIngresado: string, claveIngresada: string): boolean {
    return (
      usuarioIngresado.trim() === this.usuarioValido &&
      claveIngresada.trim() === this.claveValida
    );
  }

  /**
   * Activa la sesión. Se invoca cuando el usuario ya va a entrar a /principal,
   * para que el Header cambie en ese momento y no antes.
   */
  iniciarSesion(usuarioIngresado: string): void {
    this.estaLogueado = true;
    this.usuarioActual = usuarioIngresado.trim();
  }

  /**
   * Cierra la sesión activa y limpia las variables globales
   */
  cerrarSesion(): void {
    this.estaLogueado = false;
    this.usuarioActual = '';
  }
}