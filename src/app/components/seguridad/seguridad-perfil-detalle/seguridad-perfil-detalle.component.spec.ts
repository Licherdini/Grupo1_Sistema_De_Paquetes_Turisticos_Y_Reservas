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
});