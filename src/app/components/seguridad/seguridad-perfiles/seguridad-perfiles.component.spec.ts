import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SeguridadPerfilesComponent } from './seguridad-perfiles.component';

describe('SeguridadPerfilesComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SeguridadPerfilesComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('debe listar los perfiles registrados', async () => {
    const fixture = TestBed.createComponent(SeguridadPerfilesComponent);
    await fixture.whenStable();
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('agente');
    expect(texto).toContain('Inactivo');
  });

  it('al pulsar una fila navega a la ficha del perfil', async () => {
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(SeguridadPerfilesComponent);
    await fixture.whenStable();
    const filas = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    (filas[1] as HTMLElement).click();
    expect(navegar).toHaveBeenCalledWith(['/seguridad', 'perfiles', 'agente']);
  });
});