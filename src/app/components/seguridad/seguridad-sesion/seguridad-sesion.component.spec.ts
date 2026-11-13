import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SeguridadSesionComponent } from './seguridad-sesion.component';
import { AuthService } from '../../../services/auth.service';

describe('SeguridadSesionComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SeguridadSesionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('debe mostrar el usuario en mayúsculas y su rol', async () => {
    const authService = TestBed.inject(AuthService);
    authService.iniciarSesion('admin');
    const fixture = TestBed.createComponent(SeguridadSesionComponent);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('ADMIN');
    expect(texto).toContain('Administrador');
  });

  it('debe cerrar la sesión y volver al login al pulsar "Cerrar sesión"', async () => {
    const authService = TestBed.inject(AuthService);
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    authService.iniciarSesion('admin');
    const fixture = TestBed.createComponent(SeguridadSesionComponent);
    await fixture.whenStable();
    const boton = (fixture.nativeElement as HTMLElement).querySelector('button.btn-danger') as HTMLButtonElement;
    boton.click();
    expect(authService.estaLogueado()).toBe(false);
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });
});