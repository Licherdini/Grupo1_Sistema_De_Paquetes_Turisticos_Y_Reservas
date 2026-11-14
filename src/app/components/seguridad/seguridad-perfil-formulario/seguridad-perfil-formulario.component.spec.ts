import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { SeguridadPerfilFormularioComponent } from './seguridad-perfil-formulario.component';
import { AuthService } from '../../../services/auth.service';

describe('SeguridadPerfilFormularioComponent', () => {
  function crearFormulario(modo: 'crear' | 'editar', usuario?: string) {
    TestBed.configureTestingModule({
      imports: [SeguridadPerfilFormularioComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { modo },
              paramMap: convertToParamMap(usuario ? { usuario } : {}),
            },
          },
        },
      ],
    });
    return TestBed.createComponent(SeguridadPerfilFormularioComponent);
  }

  beforeEach(() => sessionStorage.clear());

  it('en modo crear debe iniciar vacío y con el botón deshabilitado', async () => {
    const fixture = crearFormulario('crear');
    await fixture.whenStable();
    expect(fixture.componentInstance.formularioValido).toBe(false);
    const boton = (fixture.nativeElement as HTMLElement).querySelector('button[type=submit]') as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Nuevo perfil de usuario');
  });

  it('al guardar solo simula el resultado y no agrega perfiles', async () => {
    const fixture = crearFormulario('crear');
    const authService = TestBed.inject(AuthService);
    const antes = authService.perfiles.length;
    const formulario = fixture.componentInstance;
    formulario.usuario = 'nuevo';
    formulario.nombreCompleto = 'Perfil Nuevo';
    formulario.clave = 'abc123';
    formulario.guardar();
    await fixture.whenStable();
    expect(formulario.formularioValido).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Maqueta: se crearía el perfil "nuevo"');
    expect(authService.perfiles.length).toBe(antes);
  });

  it('en modo editar debe precargar los datos del perfil de la URL', async () => {
    const fixture = crearFormulario('editar', 'admin');
    await fixture.whenStable();
    const formulario = fixture.componentInstance;
    expect(formulario.nombreCompleto).toBe('Administrador del sistema');
    expect(formulario.rol).toBe('Administrador');
    expect(formulario.estado).toBe('Activo');
    expect(formulario.formularioValido).toBe(true);
  });

  it('debe avisar si el perfil a editar no existe', async () => {
    const fixture = crearFormulario('editar', 'fantasma');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No existe un perfil');
  });
});