/* ==========================================================================
   ARCHIVO: src/app/services/auth.service.ts
   MÓDULO 1: Seguridad, Autenticación y Perfiles (Jhon Herrera Merchán).
   ========================================================================== */

import { Injectable, computed, signal } from '@angular/core';

export type RolUsuario = 'Administrador' | 'Agente de viajes' | 'Auditor';
export type EstadoCuenta = 'Activo' | 'Bloqueado' | 'Inactivo';

export interface PerfilUsuario {
  usuario: string;
  clave: string;
  rol: RolUsuario;
  nombreCompleto: string;
  estado: EstadoCuenta;
  // Eliminado lógico: el perfil deja de mostrarse y de poder ingresar,
  // pero sigue en el arreglo (reaparece al reiniciar la app o al ponerlo en false)
  eliminado: boolean;
}

// Datos que captura el diálogo de crear / modificar un perfil
export interface DatosPerfil {
  usuario: string;
  nombreCompleto: string;
  rol: RolUsuario;
  estado: EstadoCuenta;
  clave: string;
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

  // 2. Perfiles registrados (simulación académica de una base de usuarios).
  //    Es un signal: la tabla del Módulo 1 se actualiza sola al crear, modificar o eliminar.
  //    Vive solo en memoria: al reiniciar la aplicación vuelve a este estado inicial.
  public perfiles = signal<PerfilUsuario[]>([
    {
      usuario: this.usuarioValido,
      clave: this.claveValida,
      rol: 'Administrador',
      nombreCompleto: 'Administrador del sistema',
      estado: 'Activo',
      eliminado: false
    },
    {
      usuario: 'agente',
      clave: 'viajes2026',
      rol: 'Agente de viajes',
      nombreCompleto: 'Agente de ventas',
      estado: 'Activo',
      eliminado: false
    },
    {
      usuario: 'auditor',
      clave: 'revision2026',
      rol: 'Auditor',
      nombreCompleto: 'Auditor de accesos',
      estado: 'Inactivo',
      eliminado: false
    }
  ]);

  // Perfiles que se muestran en pantalla (sin los eliminados lógicamente)
  public perfilesVisibles = computed(() => this.perfiles().filter((perfil) => !perfil.eliminado));

  // Perfil elegido en la tabla; el diálogo lo lee (null = el diálogo trabaja en modo crear)
  public perfilSeleccionado = signal<PerfilUsuario | null>(null);

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
   * COMPARA las credenciales ingresadas con los perfiles registrados.
   * Un perfil eliminado, bloqueado o inactivo no puede ingresar.
   * No modifica el estado de la sesión.
   */
  credencialesValidas(usuarioIngresado: string, claveIngresada: string): boolean {
    const perfil = this.buscarPerfil(usuarioIngresado.trim());
    return (
      !!perfil &&
      !perfil.eliminado &&
      perfil.estado === 'Activo' &&
      perfil.clave === claveIngresada.trim()
    );
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

  // ---------------------------------------------------------------------
  // CRUD de perfiles (variables y métodos de servicio, sin base de datos)
  // ---------------------------------------------------------------------

  /** True si el usuario ya existe, incluso si está eliminado lógicamente. */
  usuarioExiste(usuario: string): boolean {
    return this.perfiles().some((perfil) => perfil.usuario === usuario.trim());
  }

  /**
   * Devuelve por qué un perfil no puede eliminarse ni cambiar de estado
   * (null si no tiene restricciones).
   */
  motivoProtegido(usuario: string): string | null {
    if (usuario === this.usuarioValido) {
      return 'es la cuenta administradora base del sistema.';
    }
    if (usuario === this.usuarioActual()) {
      return 'tiene la sesión activa en este momento.';
    }
    return null;
  }

  /** Create: agrega un perfil nuevo. Falla (false) si el usuario ya existe. */
  crearPerfil(datos: DatosPerfil): boolean {
    const usuario = datos.usuario.trim();
    if (this.usuarioExiste(usuario)) {
      return false;
    }
    const nuevo: PerfilUsuario = {
      usuario,
      clave: datos.clave.trim(),
      rol: datos.rol,
      nombreCompleto: datos.nombreCompleto.trim(),
      estado: datos.estado,
      eliminado: false
    };
    this.perfiles.update((lista) => [...lista, nuevo]);
    return true;
  }

  /**
   * Update: modifica un perfil. La clave vacía significa "no cambiarla".
   * Los perfiles protegidos conservan su estado.
   */
  actualizarPerfil(usuario: string, cambios: Partial<Omit<DatosPerfil, 'usuario'>>): boolean {
    if (!this.perfiles().some((perfil) => perfil.usuario === usuario)) {
      return false;
    }
    const protegido = this.motivoProtegido(usuario) !== null;
    this.perfiles.update((lista) =>
      lista.map((perfil) =>
        perfil.usuario !== usuario
          ? perfil
          : {
              ...perfil,
              nombreCompleto: cambios.nombreCompleto?.trim() || perfil.nombreCompleto,
              rol: cambios.rol ?? perfil.rol,
              estado: protegido ? perfil.estado : (cambios.estado ?? perfil.estado),
              clave: cambios.clave?.trim() ? cambios.clave.trim() : perfil.clave
            }
      )
    );
    if (usuario === this.usuarioActual() && cambios.rol) {
      this.rolActual.set(cambios.rol);
    }
    return true;
  }

  /**
   * Delete lógico: marca el perfil como eliminado. No se pierde del arreglo.
   * Para restaurarlo basta poner eliminado: false en el código o reiniciar la app.
   */
  eliminarPerfil(usuario: string): boolean {
    if (this.motivoProtegido(usuario) !== null) {
      return false;
    }
    if (!this.perfiles().some((perfil) => perfil.usuario === usuario && !perfil.eliminado)) {
      return false;
    }
    this.perfiles.update((lista) =>
      lista.map((perfil) => (perfil.usuario === usuario ? { ...perfil, eliminado: true } : perfil))
    );
    return true;
  }

  // ---------------------------------------------------------------------

  private buscarPerfil(usuario: string): PerfilUsuario | undefined {
    return this.perfiles().find((perfil) => perfil.usuario === usuario);
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
      const perfil = this.perfiles().find(
        (p) => p.usuario === datos.usuario && p.estado === 'Activo' && !p.eliminado
      );
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