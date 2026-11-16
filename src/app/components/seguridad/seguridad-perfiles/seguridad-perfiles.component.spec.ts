import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SeguridadPerfilesComponent } from './seguridad-perfiles.component';
import { AuthService } from '../../../services/auth.service';

describe('SeguridadPerfilesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadPerfilesComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(SeguridadPerfilesComponent);
    await fixture.whenStable();
    return fixture;
  }

  const filas = (fixture: { nativeElement: unknown }) =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('tr.mat-mdc-row')) as HTMLElement[];

  it('debe listar los perfiles registrados en una tabla de al menos 5 columnas de datos', async () => {
    const fixture = await crear();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('agente');
    expect(texto).toContain('Inactivo');
    expect(fixture.componentInstance.columnas.length - 1).toBeGreaterThanOrEqual(5);
    expect(filas(fixture).length).toBe(3);
  });

  it('debe filtrar la tabla con el input', async () => {
    const fixture = await crear();
    fixture.componentInstance.textoFiltro = 'audit';
    fixture.componentInstance.aplicarFiltro('audit');
    await fixture.whenStable();
    expect(filas(fixture).length).toBe(1);
    expect(filas(fixture)[0].textContent).toContain('auditor');

    fixture.componentInstance.aplicarFiltro('zzz');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No hay perfiles que coincidan');
  });

  it('al pulsar una fila navega a la ficha del perfil', async () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = await crear();
    filas(fixture)[1].click();
    expect(navegar).toHaveBeenCalledWith(['/seguridad', 'perfiles', 'agente']);
  });

  it('los botones de la fila no navegan a la ficha', async () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({ afterClosed: () => of(false) } as never);
    const fixture = await crear();
    (filas(fixture)[1].querySelector('button.btn-outline-dark') as HTMLButtonElement).click();
    expect(navegar).not.toHaveBeenCalled();
  });

  it('Modificar abre el diálogo con el perfil elegido', async () => {
    const abrir = vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({ afterClosed: () => of(false) } as never);
    const authService = TestBed.inject(AuthService);
    const fixture = await crear();
    (filas(fixture)[1].querySelector('button.btn-outline-dark') as HTMLButtonElement).click();
    expect(abrir).toHaveBeenCalled();
    expect(authService.perfilSeleccionado()?.usuario).toBe('agente');
  });

  it('Eliminar confirmado quita la fila (eliminado lógico) y cancelado no hace nada', async () => {
    const dialogo = TestBed.inject(MatDialog);
    const authService = TestBed.inject(AuthService);
    const fixture = await crear();

    const abrir = vi.spyOn(dialogo, 'open').mockReturnValue({ afterClosed: () => of(false) } as never);
    (filas(fixture)[1].querySelector('button.btn-outline-danger') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(filas(fixture).length).toBe(3);

    abrir.mockReturnValue({ afterClosed: () => of(true) } as never);
    (filas(fixture)[1].querySelector('button.btn-outline-danger') as HTMLButtonElement).click();
    await new Promise((resolver) => setTimeout(resolver));
    await fixture.whenStable();
    expect(filas(fixture).length).toBe(2);
    expect(authService.perfiles().length).toBe(3);
  });

  it('el botón "+ Nuevo perfil" abre el diálogo en modo crear', async () => {
    const abrir = vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({ afterClosed: () => of(false) } as never);
    const authService = TestBed.inject(AuthService);
    authService.perfilSeleccionado.set(authService.perfiles()[0]);
    const fixture = await crear();
    ((fixture.nativeElement as HTMLElement).querySelector('button.btn-dark') as HTMLButtonElement).click();
    expect(abrir).toHaveBeenCalled();
    expect(authService.perfilSeleccionado()).toBeNull();
  });
});