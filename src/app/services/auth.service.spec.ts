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
    const inactivo = service.perfiles.find((perfil) => !perfil.activo)!;
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
});