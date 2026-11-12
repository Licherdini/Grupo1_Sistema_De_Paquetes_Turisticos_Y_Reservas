import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ModuloSeguridadComponent } from './seguridad.component';
import { AuthService } from '../../services/auth.service';

describe('ModuloSeguridadComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ModuloSeguridadComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('debe mostrar el usuario en mayúsculas y su rol', async () => {
    const authService = TestBed.inject(AuthService);
    authService.iniciarSesion('admin');
    const fixture = TestBed.createComponent(ModuloSeguridadComponent);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('ADMIN');
    expect(texto).toContain('Administrador');
  });

  it('debe listar los perfiles registrados', async () => {
    const fixture = TestBed.createComponent(ModuloSeguridadComponent);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('agente');
    expect(texto).toContain('Inactivo');
  });

  it('debe filtrar el registro de accesos por texto', () => {
    const authService = TestBed.inject(AuthService);
    authService.registrarAcceso('otro', false);
    authService.registrarAcceso('admin', true);
    const fixture = TestBed.createComponent(ModuloSeguridadComponent);
    fixture.componentInstance.filtroAccesos = 'otro';
    expect(fixture.componentInstance.accesosFiltrados().length).toBe(1);
  });
});