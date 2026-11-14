import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PromocionesOfertasComponent } from './promociones-ofertas.component';

describe('PromocionesOfertasComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesOfertasComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function crear() {
    return TestBed.createComponent(PromocionesOfertasComponent);
  }

  it('debe mostrar las campañas iniciales con su código', async () => {
    const fixture = crear();
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Cyber Travel Galápagos');
    expect(texto).toContain('UGVIAJA20');
    expect(texto).toContain('-20% OFF');
  });

  it('debe filtrar las campañas por alianza bancaria', () => {
    const ofertas = crear().componentInstance;
    ofertas.filtroAlianza = ofertas.alianzas[2];
    expect(ofertas.campanasFiltradas().length).toBe(1);
    ofertas.filtroAlianza = 'Todos';
    expect(ofertas.campanasFiltradas().length).toBe(ofertas.campanas.length);
  });

  it('no debe permitir publicar con datos incompletos o código repetido', () => {
    const ofertas = crear().componentInstance;
    expect(ofertas.formularioValido()).toBe(false);
    ofertas.nuevaCampana = { titulo: 'Campaña nueva', alianza: ofertas.alianzas[0], descuento: 20, codigo: 'ugviaja20' };
    expect(ofertas.codigoRepetido()).toBe(true);
    expect(ofertas.formularioValido()).toBe(false);
  });

  it('debe publicar una campaña con el código en mayúsculas y limpiar el formulario', () => {
    const ofertas = crear().componentInstance;
    const antes = ofertas.campanas.length;
    ofertas.nuevaCampana = { titulo: 'Black Friday Andes', alianza: ofertas.alianzas[1], descuento: 30, codigo: 'bf 30' };
    ofertas.publicarCampana();
    expect(ofertas.campanas.length).toBe(antes + 1);
    expect(ofertas.campanas[0].codigo).toBe('BF30');
    expect(ofertas.nuevaCampana.titulo).toBe('');
  });

  it('debe finalizar (eliminar) una campaña', () => {
    const ofertas = crear().componentInstance;
    const primera = ofertas.campanas[0];
    ofertas.finalizarCampana(primera);
    expect(ofertas.campanas.some((c) => c.id === primera.id)).toBe(false);
  });

  it('debe navegar a los cupones con el código como parámetro', () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const ofertas = crear().componentInstance;
    ofertas.gestionarCupon(ofertas.campanas[0]);
    expect(navegar).toHaveBeenCalledWith(['/promociones', 'cupones'], { queryParams: { codigo: 'UGVIAJA20' } });
  });
});
