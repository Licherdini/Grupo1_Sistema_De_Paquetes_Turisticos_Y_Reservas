import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ModuloLayoutComponent } from './modulo-layout.component';

describe('ModuloLayoutComponent', () => {
  // El layout lee el módulo desde data: { moduloId } de su ruta
  function crearLayout(moduloId: number) {
    TestBed.configureTestingModule({
      imports: [ModuloLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { moduloId } } } },
      ],
    });
    return TestBed.createComponent(ModuloLayoutComponent);
  }

  it('debe mostrar título, responsable y submenú del módulo 1', async () => {
    const fixture = crearLayout(1);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Seguridad y Perfiles');
    expect(texto).toContain('Jhon Herrera Merchán');
    expect(texto).toContain('Registro de accesos');
  });

  it('no debe mostrar submenú en un módulo de una sola página (módulo 2)', async () => {
    const fixture = crearLayout(2);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Catálogo de Paquetes');
    expect(el.querySelector('.submenu-modulo')).toBeNull();
  });
});