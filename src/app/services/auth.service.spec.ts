import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('debe iniciar sin ninguna sesión activa', () => {
    expect(service.estaLogueado).toBe(false);
    expect(service.usuarioActual).toBe('');
  });

  it('debe conceder acceso al ingresar credenciales válidas', () => {
    const resultado = service.validarAcceso(service.usuarioValido, service.claveValida);
    expect(resultado).toBe(true);
    expect(service.estaLogueado).toBe(true);
    expect(service.usuarioActual).toBe(service.usuarioValido);
  });

  it('debe denegar el acceso ante credenciales incorrectas', () => {
    const resultado = service.validarAcceso('otro', 'incorrecta');
    expect(resultado).toBe(false);
    expect(service.estaLogueado).toBe(false);
  });

  it('debe limpiar los datos de sesión al cerrar sesión', () => {
    service.validarAcceso(service.usuarioValido, service.claveValida);
    service.cerrarSesion();
    expect(service.estaLogueado).toBe(false);
    expect(service.usuarioActual).toBe('');
  });
});