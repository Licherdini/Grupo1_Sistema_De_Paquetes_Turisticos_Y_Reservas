import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SeguridadPerfilDialogoComponent } from './seguridad-perfil-dialogo.component';
import { AuthService } from '../../../services/auth.service';

describe('SeguridadPerfilDialogoComponent', () => {
  const cerrar = vi.fn();

  function crear(seleccionar?: string) {
    TestBed.configureTestingModule({
      imports: [SeguridadPerfilDialogoComponent],
      providers: [{ provide: MatDialogRef, useValue: { close: cerrar } }],
    });
    const authService = TestBed.inject(AuthService);
    authService.perfilSeleccionado.set(
      seleccionar ? authService.perfiles().find((p) => p.usuario === seleccionar)! : null
    );
    const dialogo = vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({ afterClosed: () => of(true) } as never);
    const snack = vi.spyOn(TestBed.inject(MatSnackBar), 'open').mockReturnValue(undefined as never);
    const fixture = TestBed.createComponent(SeguridadPerfilDialogoComponent);
    return { fixture, componente: fixture.componentInstance, authService, dialogo, snack };
  }

  beforeEach(() => cerrar.mockClear());

  it('en modo crear inicia vacío y con el botón deshabilitado', async () => {
    const { fixture, componente } = crear();
    await fixture.whenStable();
    expect(componente.modo).toBe('crear');
    expect(componente.formularioValido).toBe(false);
    const boton = (fixture.nativeElement as HTMLElement).querySelector('button[type=submit]') as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
  });

  it('en modo editar recupera los datos del perfil seleccionado', async () => {
    const { fixture, componente } = crear('agente');
    await fixture.whenStable();
    expect(componente.modo).toBe('editar');
    expect(componente.nombreCompleto).toBe('Agente de ventas');
    expect(componente.rol).toBe('Agente de viajes');
    expect(componente.formularioValido).toBe(true);
  });

  it('valida usuario repetido y clave corta al crear', () => {
    const { componente } = crear();
    componente.usuario = 'agente';
    componente.nombreCompleto = 'Alguien';
    componente.clave = 'abc123';
    expect(componente.usuarioDuplicado).toBe(true);
    expect(componente.formularioValido).toBe(false);
    componente.usuario = 'otro';
    componente.clave = '123';
    expect(componente.formularioValido).toBe(false);
    componente.clave = '1234';
    expect(componente.formularioValido).toBe(true);
  });

  it('al guardar pide confirmación, crea el perfil, avisa y cierra', () => {
    const { componente, authService, dialogo, snack } = crear();
    componente.usuario = 'nuevo';
    componente.nombreCompleto = 'Perfil Nuevo';
    componente.clave = 'abc123';
    componente.guardar();
    expect(dialogo).toHaveBeenCalled();
    expect(authService.perfiles().some((p) => p.usuario === 'nuevo')).toBe(true);
    expect(snack).toHaveBeenCalled();
    expect(cerrar).toHaveBeenCalledWith(true);
  });

  it('al guardar cambios modifica el perfil del servicio', () => {
    const { componente, authService } = crear('agente');
    componente.nombreCompleto = 'Agente Premium';
    componente.guardar();
    expect(authService.perfiles().find((p) => p.usuario === 'agente')!.nombreCompleto).toBe('Agente Premium');
  });

  it('si el usuario cancela la confirmación no se guarda nada', () => {
    const { componente, authService, dialogo } = crear('agente');
    dialogo.mockReturnValue({ afterClosed: () => of(false) } as never);
    componente.nombreCompleto = 'No debe guardarse';
    componente.guardar();
    expect(authService.perfiles().find((p) => p.usuario === 'agente')!.nombreCompleto).toBe('Agente de ventas');
    expect(cerrar).not.toHaveBeenCalled();
  });

  it('el perfil admin no permite cambiar el estado', () => {
    const { componente } = crear('admin');
    expect(componente.motivoProtegido).toContain('administradora');
  });
});