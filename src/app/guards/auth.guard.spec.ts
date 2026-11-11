import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  const ejecutarGuardia = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('debe redirigir a /login cuando no existe sesión activa', () => {
    const resultado = ejecutarGuardia();
    expect(resultado instanceof UrlTree).toBe(true);
    expect((resultado as UrlTree).toString()).toBe('/login');
  });

  it('debe permitir la navegación cuando la sesión está activa', () => {
    const auth = TestBed.inject(AuthService);
    auth.validarAcceso(auth.usuarioValido, auth.claveValida);
    expect(ejecutarGuardia()).toBe(true);
  });
});