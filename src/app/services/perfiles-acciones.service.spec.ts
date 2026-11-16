import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { PerfilesAccionesService } from './perfiles-acciones.service';

// Estas pruebas usan los diálogos REALES de Material (sin simular MatDialog)
describe('PerfilesAccionesService', () => {
  let acciones: PerfilesAccionesService;
  let authService: AuthService;

  const espera = () => new Promise((resolver) => setTimeout(resolver, 30));
  const boton = (selector: string) => document.querySelector(selector) as HTMLButtonElement | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    acciones = TestBed.inject(PerfilesAccionesService);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => TestBed.inject(MatDialog).closeAll());

  it('eliminar muestra la advertencia y, al confirmar, elimina lógicamente', async () => {
    const perfil = authService.perfiles().find((p) => p.usuario === 'agente')!;
    const resultado = acciones.eliminar(perfil);
    await espera();

    expect(document.querySelector('mat-dialog-container')?.textContent).toContain('Eliminar perfil');
    boton('mat-dialog-actions button.btn-danger')!.click();

    expect(await resultado).toBe(true);
    expect(authService.perfilesVisibles().some((p) => p.usuario === 'agente')).toBe(false);
  });

  it('eliminar con Cancelar no elimina nada', async () => {
    const perfil = authService.perfiles().find((p) => p.usuario === 'agente')!;
    const resultado = acciones.eliminar(perfil);
    await espera();
    boton('mat-dialog-actions button.btn-outline-secondary')!.click();

    expect(await resultado).toBe(false);
    expect(authService.perfilesVisibles().length).toBe(3);
  });

  it('eliminar la cuenta admin solo muestra un aviso informativo', async () => {
    const admin = authService.perfiles().find((p) => p.usuario === 'admin')!;
    const resultado = acciones.eliminar(admin);
    await espera();

    expect(document.querySelector('mat-dialog-container')?.textContent).toContain('No se puede eliminar');
    expect(document.querySelectorAll('mat-dialog-actions button').length).toBe(1);
    boton('mat-dialog-actions button')!.click();

    expect(await resultado).toBe(false);
    expect(authService.perfilesVisibles().length).toBe(3);
  });

  it('modificar abre el diálogo real con los datos del perfil', async () => {
    acciones.modificar(authService.perfiles().find((p) => p.usuario === 'agente')!);
    await espera();
    const campo = document.querySelector('#dlgNombre') as HTMLInputElement;
    expect(document.querySelector('mat-dialog-container')?.textContent).toContain('Modificar perfil: agente');
    expect(campo.value).toBe('Agente de ventas');
  });
});