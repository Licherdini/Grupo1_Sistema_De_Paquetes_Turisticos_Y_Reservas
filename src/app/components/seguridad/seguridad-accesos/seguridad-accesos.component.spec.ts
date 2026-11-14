import { TestBed } from '@angular/core/testing';
import { SeguridadAccesosComponent } from './seguridad-accesos.component';
import { AuthService } from '../../../services/auth.service';

describe('SeguridadAccesosComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SeguridadAccesosComponent],
    }).compileComponents();
  });

  function prepararAccesos() {
    const authService = TestBed.inject(AuthService);
    authService.registrarAcceso('otro', false);
    authService.registrarAcceso('admin', true);
    return authService;
  }

  it('debe filtrar el registro de accesos por nombre de usuario', () => {
    prepararAccesos();
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    fixture.componentInstance.filtroAccesos = 'otro';
    expect(fixture.componentInstance.accesosFiltrados().length).toBe(1);
  });

  it('debe filtrar por resultado Denegado y Concedido', () => {
    prepararAccesos();
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    fixture.componentInstance.filtroResultado = 'Denegado';
    expect(fixture.componentInstance.accesosFiltrados().map((a) => a.usuario)).toEqual(['otro']);
    fixture.componentInstance.filtroResultado = 'Concedido';
    expect(fixture.componentInstance.accesosFiltrados().map((a) => a.usuario)).toEqual(['admin']);
  });

  it('debe combinar usuario y resultado', () => {
    prepararAccesos();
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    fixture.componentInstance.filtroAccesos = 'admin';
    fixture.componentInstance.filtroResultado = 'Denegado';
    expect(fixture.componentInstance.accesosFiltrados().length).toBe(0);
  });

  it('debe mostrar Concedido/Denegado en la tabla', async () => {
    prepararAccesos();
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Concedido');
    expect(texto).toContain('Denegado');
  });

  it('debe mostrar un mensaje si no hay accesos', async () => {
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No hay accesos para mostrar');
  });

  it('"Limpiar historial" pide confirmación y solo simula: no borra registros', async () => {
    const authService = prepararAccesos();
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    const componente = fixture.componentInstance;
    componente.pedirLimpieza();
    expect(componente.confirmandoLimpieza()).toBe(true);
    componente.confirmarLimpieza();
    await fixture.whenStable();
    expect(componente.confirmandoLimpieza()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Maqueta: se eliminarían 2 registros');
    expect(authService.registroAccesos().length).toBe(2);
  });
});