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
});