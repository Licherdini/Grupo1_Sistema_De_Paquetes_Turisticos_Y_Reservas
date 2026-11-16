import { TestBed } from '@angular/core/testing';
import { IconoComponent } from './icono.component';

describe('IconoComponent', () => {
  async function crear(nombre: string, relleno = false) {
    const fixture = TestBed.createComponent(IconoComponent);
    fixture.componentRef.setInput('nombre', nombre);
    fixture.componentRef.setInput('relleno', relleno);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('debe dibujar el icono como SVG decorativo sin texto ni emojis', async () => {
    const el = await crear('candado');
    const svg = el.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelectorAll('path').length).toBe(2);
    expect(el.textContent?.trim()).toBe('');
  });

  it('debe heredar el color y no rellenar por defecto', async () => {
    const svg = (await crear('buscar')).querySelector('svg')!;
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('fill')).toBe('none');
  });

  it('debe rellenar el icono cuando se pide relleno', async () => {
    const svg = (await crear('estrella', true)).querySelector('svg')!;
    expect(svg.getAttribute('fill')).toBe('currentColor');
  });
});