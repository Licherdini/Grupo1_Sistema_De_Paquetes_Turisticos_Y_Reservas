import { TestBed } from '@angular/core/testing';
import { SeguridadAccesosComponent } from './seguridad-accesos.component';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';

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

    describe('Limpiar historial', () => {
    const boton = (fixture: { nativeElement: unknown }) =>
      (fixture.nativeElement as HTMLElement).querySelector('button.btn-outline-danger') as HTMLButtonElement | null;

    const dialogoCon = (resultado: boolean) =>
      vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({ afterClosed: () => of(resultado) } as never);

    it('solo el Administrador ve el botón', async () => {
      const authService = prepararAccesos();
      authService.iniciarSesion('agente');
      const fixture = TestBed.createComponent(SeguridadAccesosComponent);
      await fixture.whenStable();
      expect(boton(fixture)).toBeNull();

      authService.cerrarSesion();
      authService.iniciarSesion('admin');
      await fixture.whenStable();
      expect(boton(fixture)).not.toBeNull();
    });

    it('el botón está deshabilitado cuando no hay registros', async () => {
      TestBed.inject(AuthService).iniciarSesion('admin');
      const fixture = TestBed.createComponent(SeguridadAccesosComponent);
      await fixture.whenStable();
      expect(boton(fixture)!.disabled).toBe(true);
    });

    it('al confirmar en el diálogo elimina todo el historial y avisa', async () => {
      const authService = prepararAccesos();
      authService.iniciarSesion('admin');
      const abrir = dialogoCon(true);
      const fixture = TestBed.createComponent(SeguridadAccesosComponent);
      fixture.componentInstance.filtroAccesos = 'otro'; // el filtro no limita el borrado
      await fixture.componentInstance.limpiarHistorial();
      await fixture.whenStable();
      expect(abrir).toHaveBeenCalled();
      expect(authService.registroAccesos().length).toBe(0);
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Se eliminaron 2 registros');
    });

    it('si se cancela el diálogo no borra nada', async () => {
      const authService = prepararAccesos();
      authService.iniciarSesion('admin');
      dialogoCon(false);
      const fixture = TestBed.createComponent(SeguridadAccesosComponent);
      await fixture.componentInstance.limpiarHistorial();
      expect(authService.registroAccesos().length).toBe(2);
    });

    it('un usuario sin permiso no abre el diálogo ni borra nada', async () => {
      const authService = prepararAccesos();
      authService.iniciarSesion('agente');
      const abrir = dialogoCon(true);
      const fixture = TestBed.createComponent(SeguridadAccesosComponent);
      await fixture.componentInstance.limpiarHistorial();
      expect(abrir).not.toHaveBeenCalled();
      expect(authService.registroAccesos().length).toBe(2);
    });
  });
});