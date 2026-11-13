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

  it('debe filtrar el registro de accesos por texto', () => {
    const authService = TestBed.inject(AuthService);
    authService.registrarAcceso('otro', false);
    authService.registrarAcceso('admin', true);
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    fixture.componentInstance.filtroAccesos = 'otro';
    expect(fixture.componentInstance.accesosFiltrados().length).toBe(1);
  });

  it('debe filtrar por resultado (fallido)', () => {
    const authService = TestBed.inject(AuthService);
    authService.registrarAcceso('otro', false);
    authService.registrarAcceso('admin', true);
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    fixture.componentInstance.filtroAccesos = 'fallido';
    expect(fixture.componentInstance.accesosFiltrados().length).toBe(1);
  });

  it('debe mostrar un mensaje si no hay accesos', async () => {
    const fixture = TestBed.createComponent(SeguridadAccesosComponent);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No hay accesos para mostrar');
  });
});