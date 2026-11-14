import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
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

  beforeEach(() => sessionStorage.clear());

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

  it('debe enlazar "Editar perfil" con el formulario de edición (maqueta)', async () => {
    const fixture = crearFicha('admin');
    await fixture.whenStable();
    const enlace = (fixture.nativeElement as HTMLElement).querySelector('a.btn') as HTMLAnchorElement;
    expect(enlace.textContent).toContain('Editar perfil');
    expect(enlace.getAttribute('href')).toBe('/seguridad/perfiles/admin/editar');
  });

  it('las acciones solo simulan el resultado y no modifican los perfiles', async () => {
    const fixture = crearFicha('admin');
    const authService = TestBed.inject(AuthService);
    const antes = JSON.stringify(authService.perfiles);
    const ficha = fixture.componentInstance;

    ficha.reiniciarIntentos();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Maqueta: se reiniciarían a 0');

    ficha.cambiarEstado();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('de Activo a Bloqueado');

    expect(JSON.stringify(authService.perfiles)).toBe(antes);
  });

  it('"Dar de baja" pide confirmación dentro de la página antes de simular', async () => {
    const fixture = crearFicha('agente');
    const authService = TestBed.inject(AuthService);
    const total = authService.perfiles.length;
    const ficha = fixture.componentInstance;

    ficha.pedirBaja();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('¿Confirmas dar de baja');

    ficha.confirmarBaja();
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).not.toContain('¿Confirmas dar de baja');
    expect(texto).toContain('Maqueta: se daría de baja el perfil "agente"');
    expect(authService.perfiles.length).toBe(total);
  });
});