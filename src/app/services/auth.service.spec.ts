import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('debe iniciar sin ninguna sesión activa', () => {
    expect(service.estaLogueado()).toBe(false);
    expect(service.usuarioActual()).toBe('');
  });

  it('debe validar credenciales correctas sin iniciar la sesión todavía', () => {
    const resultado = service.credencialesValidas(service.usuarioValido, service.claveValida);
    expect(resultado).toBe(true);
    expect(service.estaLogueado()).toBe(false);
  });

  it('debe rechazar credenciales incorrectas', () => {
    expect(service.credencialesValidas('otro', 'incorrecta')).toBe(false);
    expect(service.estaLogueado()).toBe(false);
  });

  it('debe activar la sesión al invocar iniciarSesion', () => {
    service.iniciarSesion(service.usuarioValido);
    expect(service.estaLogueado()).toBe(true);
    expect(service.usuarioActual()).toBe(service.usuarioValido);
  });

  it('debe limpiar los datos de sesión al cerrar sesión', () => {
    service.iniciarSesion(service.usuarioValido);
    service.cerrarSesion();
    expect(service.estaLogueado()).toBe(false);
    expect(service.usuarioActual()).toBe('');
  });

  it('debe rechazar un perfil inactivo aunque la clave sea correcta', () => {
    const inactivo = service.perfiles().find((perfil) => perfil.estado !== 'Activo')!;
    expect(service.credencialesValidas(inactivo.usuario, inactivo.clave)).toBe(false);
  });

  it('debe asignar el rol del perfil al iniciar sesión', () => {
    service.iniciarSesion(service.usuarioValido);
    expect(service.rolActual()).toBe('Administrador');
  });

  it('debe registrar los accesos con el más reciente primero', () => {
    service.registrarAcceso('otro', false);
    service.registrarAcceso('admin', true);
    const accesos = service.registroAccesos();
    expect(accesos.length).toBe(2);
    expect(accesos[0].usuario).toBe('admin');
    expect(accesos[0].exitoso).toBe(true);
  });

  it('debe restaurar la sesión al recargar la página', () => {
    service.iniciarSesion(service.usuarioValido);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const servicioNuevo = TestBed.inject(AuthService);
    expect(servicioNuevo.estaLogueado()).toBe(true);
    expect(servicioNuevo.usuarioActual()).toBe('admin');
  });

  // ---------------- CRUD de perfiles ----------------

  describe('CRUD de perfiles', () => {
    const datosNuevo = {
      usuario: 'nuevo',
      nombreCompleto: 'Perfil Nuevo',
      rol: 'Auditor' as const,
      estado: 'Activo' as const,
      clave: 'abc123'
    };

    it('debe crear un perfil y mostrarlo entre los visibles', () => {
      const antes = service.perfilesVisibles().length;
      expect(service.crearPerfil(datosNuevo)).toBe(true);
      expect(service.perfilesVisibles().length).toBe(antes + 1);
      expect(service.credencialesValidas('nuevo', 'abc123')).toBe(true);
    });

    it('no debe crear un usuario repetido, ni siquiera si está eliminado', () => {
      expect(service.crearPerfil({ ...datosNuevo, usuario: 'agente' })).toBe(false);
      service.eliminarPerfil('agente');
      expect(service.crearPerfil({ ...datosNuevo, usuario: 'agente' })).toBe(false);
    });

    it('debe modificar nombre, rol y estado, y conservar la clave si viene vacía', () => {
      service.actualizarPerfil('agente', {
        nombreCompleto: 'Agente Senior',
        rol: 'Administrador',
        estado: 'Bloqueado',
        clave: ''
      });
      const perfil = service.perfiles().find((p) => p.usuario === 'agente')!;
      expect(perfil.nombreCompleto).toBe('Agente Senior');
      expect(perfil.rol).toBe('Administrador');
      expect(perfil.estado).toBe('Bloqueado');
      expect(perfil.clave).toBe('viajes2026');
      expect(service.credencialesValidas('agente', 'viajes2026')).toBe(false);
    });

    it('debe eliminar de forma lógica: se oculta, no puede ingresar y sigue en el arreglo', () => {
      expect(service.eliminarPerfil('agente')).toBe(true);
      expect(service.perfilesVisibles().some((p) => p.usuario === 'agente')).toBe(false);
      expect(service.perfiles().some((p) => p.usuario === 'agente')).toBe(true);
      expect(service.credencialesValidas('agente', 'viajes2026')).toBe(false);
    });

    it('no debe eliminar ni cambiar el estado de la cuenta admin ni de la sesión activa', () => {
      expect(service.eliminarPerfil('admin')).toBe(false);
      service.iniciarSesion('agente');
      expect(service.eliminarPerfil('agente')).toBe(false);
      service.actualizarPerfil('agente', { estado: 'Inactivo', rol: 'Auditor' });
      const agente = service.perfiles().find((p) => p.usuario === 'agente')!;
      expect(agente.estado).toBe('Activo');
      expect(service.rolActual()).toBe('Auditor');
    });

    it('debe ocultar de la tabla a un perfil eliminado lógicamente aunque tuviera sesión guardada', () => {
      service.iniciarSesion('agente');
      service.cerrarSesion();
      service.iniciarSesion('agente');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const nuevo = TestBed.inject(AuthService);
      nuevo.perfiles.update((l) => l.map((p) => (p.usuario === 'agente' ? { ...p, eliminado: true } : p)));
      expect(nuevo.perfilesVisibles().some((p) => p.usuario === 'agente')).toBe(false);
    });
  });
});