/* ==========================================================================
   ARCHIVO: src/app/services/auth.service.ts
   MÓDULO 1: Seguridad, Autenticación y Perfiles (Jhon Herrera Merchán).
   ========================================================================== */

import { Injectable, signal } from '@angular/core';

export type RolUsuario = 'Administrador' | 'Agente de viajes' | 'Auditor';

export interface PerfilUsuario {
  usuario: string;
  clave: string;
  rol: RolUsuario;
  nombreCompleto: string;
  activo: boolean;
}

export interface RegistroAcceso {
  fechaHora: Date;
  usuario: string;
  exitoso: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Claves del almacenamiento de la pestaña (sessionStorage)
  private readonly claveAlmacenSesion: string = 'andestravel.sesion';
  private readonly claveAlmacenAccesos: string = 'andestravel.accesos';
  private readonly maximoRegistros: number = 20;

  // 1. Variables públicas con las credenciales válidas para la validación interna
  public usuarioValido: string = 'admin';
  public claveValida: string = '12345';

  // 2. Perfiles registrados (simulación académica de una base de usuarios)
  public perfiles: PerfilUsuario[] = [
    {
      usuario: this.usuarioValido,
      clave: this.claveValida,
      rol: 'Administrador',
      nombreCompleto: 'Administrador del sistema',
      activo: true
    },
    {
      usuario: 'agente',
      clave: 'viajes2026',
      rol: 'Agente de viajes',
      nombreCompleto: 'Agente de ventas',
      activo: true
    },
    {
      usuario: 'auditor',
      clave: 'revision2026',
      rol: 'Auditor',
      nombreCompleto: 'Auditor de accesos',
      activo: false
    }
  ];

  // 3. Variables públicas globales que controlan Header y Módulo 1
  public estaLogueado = signal<boolean>(false);
  public usuarioActual = signal<string>('');
  public rolActual = signal<string>('');
  public horaInicioSesion = signal<Date | null>(null);
  public registroAccesos = signal<RegistroAcceso[]>([]);

  constructor() {
    this.restaurarSesion();
    this.registroAccesos.set(this.leerAccesos());
  }

  /**
   *  COMPARA las credenciales ingresadas con los perfiles registrados.
   * Un perfil inactivo no puede ingresar. No modifica el estado de la sesión.
   */
  credencialesValidas(usuarioIngresado: string, claveIngresada: string): boolean {
    const perfil = this.buscarPerfil(usuarioIngresado.trim());
    return !!perfil && perfil.activo && perfil.clave === claveIngresada.trim();
  }

  /**
   * Activa la sesión. Se invoca cuando el usuario ya va a entrar a /principal,
   * para que el Header cambie en ese momento y no antes.
   */
  iniciarSesion(usuarioIngresado: string): void {
    const usuario = usuarioIngresado.trim();
    const perfil = this.buscarPerfil(usuario);
    this.usuarioActual.set(usuario);
    this.rolActual.set(perfil ? perfil.rol : 'Sin rol asignado');
    this.horaInicioSesion.set(new Date());
    this.estaLogueado.set(true);
    this.guardarSesion();
  }

  /**
   * Cierra la sesión activa y limpia las variables globales.
   * El registro de accesos se conserva mientras la pestaña siga abierta.
   */
  cerrarSesion(): void {
    this.estaLogueado.set(false);
    this.usuarioActual.set('');
    this.rolActual.set('');
    this.horaInicioSesion.set(null);
    try {
      sessionStorage.removeItem(this.claveAlmacenSesion);
    } catch {
      /* Almacenamiento no disponible: la sesión ya se limpió en memoria. */
    }
  }

  /**
   * Deja constancia de un intento de ingreso (auditoría). El más reciente va primero.
   */
  registrarAcceso(usuarioIngresado: string, exitoso: boolean): void {
    const nuevoRegistro: RegistroAcceso = {
      fechaHora: new Date(),
      usuario: usuarioIngresado.trim(),
      exitoso
    };
    this.registroAccesos.update((lista) =>
      [nuevoRegistro, ...lista].slice(0, this.maximoRegistros)
    );
    this.guardarAccesos();
  }

  private buscarPerfil(usuario: string): PerfilUsuario | undefined {
    return this.perfiles.find((perfil) => perfil.usuario === usuario);
  }

  private guardarSesion(): void {
    try {
      const hora = this.horaInicioSesion();
      sessionStorage.setItem(
        this.claveAlmacenSesion,
        JSON.stringify({
          usuario: this.usuarioActual(),
          horaInicio: hora ? hora.toISOString() : ''
        })
      );
    } catch {
      /* Almacenamiento no disponible: la sesión sigue activa solo en memoria. */
    }
  }

  private restaurarSesion(): void {
    try {
      const crudo = sessionStorage.getItem(this.claveAlmacenSesion);
      if (!crudo) {
        return;
      }
      const datos = JSON.parse(crudo) as { usuario?: string; horaInicio?: string };
      const perfil = this.perfiles.find((p) => p.usuario === datos.usuario && p.activo);
      if (!perfil) {
        return;
      }
      const hora = new Date(datos.horaInicio ?? '');
      this.usuarioActual.set(perfil.usuario);
      this.rolActual.set(perfil.rol);
      this.horaInicioSesion.set(isNaN(hora.getTime()) ? new Date() : hora);
      this.estaLogueado.set(true);
    } catch {
      /* Datos corruptos o almacenamiento no disponible: se inicia sin sesión. */
    }
  }

  private guardarAccesos(): void {
    try {
      sessionStorage.setItem(this.claveAlmacenAccesos, JSON.stringify(this.registroAccesos()));
    } catch {
      /* Almacenamiento no disponible: el registro sigue solo en memoria. */
    }
  }

  private leerAccesos(): RegistroAcceso[] {
    try {
      const crudo = sessionStorage.getItem(this.claveAlmacenAccesos);
      if (!crudo) {
        return [];
      }
      const lista = JSON.parse(crudo) as { fechaHora: string; usuario: string; exitoso: boolean }[];
      return lista.map((acceso) => ({
        fechaHora: new Date(acceso.fechaHora),
        usuario: acceso.usuario,
        exitoso: acceso.exitoso
      }));
    } catch {
      return [];
    }
  }
}