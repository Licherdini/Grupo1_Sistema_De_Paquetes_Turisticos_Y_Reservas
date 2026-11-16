import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SeguridadPerfilDetalleComponent } from './seguridad-perfil-detalle.component';
import { AuthService } from '../../../services/auth.service';

describe('SeguridadPerfilDetalleComponent', () => {
  function crearFicha(usuario: string) {
    TestBed.configureTestingModule({
      imports: [SeguridadPerfilDetalleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ usuario }) } } },
      ],
    });
    return TestBed.createComponent(SeguridadPerfilDetalleComponent);
  }

  const confirmarTodo = () =>
    vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({ afterClosed: () => of(true) } as never);

  it('debe mostrar la ficha del perfil indicado en la URL', async () => {
    const fixture = crearFicha('admin');
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Administrador del sistema');
    expect(texto).toContain('Administrador');
  });

  it('debe contar los intentos fallidos desde el registro de accesos', async () => {
    const fixture = crearFicha('agente');
    const authService = TestBed.inject(AuthService);
    authService.registrarAcceso('agente', false);
    authService.registrarAcceso('agente', false);
    authService.registrarAcceso('agente', true);
    expect(fixture.componentInstance.intentosFallidos()).toBe(2);
    expect(fixture.componentInstance.ingresosExitosos()).toBe(1);
  });

  it('no debe mostrar la clave del perfil', async () => {
    const fixture = crearFicha('admin');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('12345');
  });

  it('debe avisar si el usuario no existe', async () => {
    const fixture = crearFicha('fantasma');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No existe un perfil');
  });

  it('"Editar perfil" abre el diálogo con el perfil de la ficha', async () => {
    const fixture = crearFicha('admin');
    const abrir = confirmarTodo();
    await fixture.whenStable();
    const boton = (fixture.nativeElement as HTMLElement).querySelector('button.btn-dark') as HTMLButtonElement;
    expect(boton.textContent).toContain('Editar perfil');
    boton.click();
    expect(abrir).toHaveBeenCalled();
    expect(TestBed.inject(AuthService).perfilSeleccionado()?.usuario).toBe('admin');
  });

  it('"Bloquear cuenta" cambia el estado real tras confirmar', async () => {
    const fixture = crearFicha('agente');
    confirmarTodo();
    await fixture.whenStable();
    await fixture.componentInstance.cambiarEstado();
    await new Promise((resolver) => setTimeout(resolver));
    await fixture.whenStable();
    expect(TestBed.inject(AuthService).perfiles().find((p) => p.usuario === 'agente')!.estado).toBe('Bloqueado');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Bloqueado');
  });

  it('"Dar de baja" elimina lógicamente y vuelve a la lista de perfiles', async () => {
    const fixture = crearFicha('agente');
    confirmarTodo();
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
    await fixture.componentInstance.darDeBaja();
    expect(TestBed.inject(AuthService).perfilesVisibles().some((p) => p.usuario === 'agente')).toBe(false);
    expect(navegar).toHaveBeenCalledWith(['/seguridad', 'perfiles']);
  });

  it('"Reiniciar intentos fallidos" sigue siendo una simulación', async () => {
    const fixture = crearFicha('admin');
    const authService = TestBed.inject(AuthService);
    const antes = JSON.stringify(authService.perfiles());
    fixture.componentInstance.reiniciarIntentos();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Maqueta: se reiniciarían a 0');
    expect(JSON.stringify(authService.perfiles())).toBe(antes);
  });
});