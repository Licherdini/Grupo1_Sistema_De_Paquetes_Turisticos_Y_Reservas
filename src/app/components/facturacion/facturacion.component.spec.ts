import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ModuloFacturacionComponent } from './facturacion.component';
import { FacturacionService } from '../../services/facturacion.service';

describe('ModuloFacturacionComponent (Módulo 5: Facturación)', () => {
  function crear() {
    TestBed.configureTestingModule({
      imports: [ModuloFacturacionComponent],
      providers: [FacturacionService]
    });

    const dialogo = vi.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as never);
    const snack = vi.spyOn(TestBed.inject(MatSnackBar), 'open').mockReturnValue(undefined as never);
    const fixture = TestBed.createComponent(ModuloFacturacionComponent);
    const service = TestBed.inject(FacturacionService);

    return { fixture, componente: fixture.componentInstance, service, dialogo, snack };
  }

  it('debe crear el componente correctamente', () => {
    const { componente } = crear();
    expect(componente).toBeTruthy();
  });

  it('debe iniciar en vista administrador y permitir cambiar a vista cliente', () => {
    const { componente } = crear();
    expect(componente.vistaActiva).toBe('admin');

    componente.vistaActiva = 'cliente';
    expect(componente.vistaActiva).toBe('cliente');
  });

  it('debe listar las facturas iniciales del servicio', () => {
    const { componente } = crear();
    expect(componente.facturas.length).toBeGreaterThanOrEqual(3);
    expect(componente.facturasFiltradas.length).toBe(componente.facturas.length);
  });

  it('debe filtrar las facturas en tiempo real según el término de búsqueda', () => {
    const { componente } = crear();
    componente.filtro = 'María';
    expect(componente.facturasFiltradas.length).toBe(1);
    expect(componente.facturasFiltradas[0].cliente).toBe('María Pérez');

    componente.filtro = 'FAC-0002';
    expect(componente.facturasFiltradas.length).toBe(1);
    expect(componente.facturasFiltradas[0].idFactura).toBe('FAC-0002');

    componente.filtro = 'inexistente';
    expect(componente.facturasFiltradas.length).toBe(0);
  });

  it('debe abrir el diálogo al solicitar modificar una factura', () => {
    const { componente, dialogo } = crear();
    const factura = componente.facturas[0];
    componente.abrirModificar(factura);
    expect(dialogo).toHaveBeenCalled();
  });

  it('debe solicitar confirmación y eliminar una factura', async () => {
    const { componente, dialogo } = crear();
    const cantidadInicial = componente.facturas.length;
    await componente.eliminar('FAC-0001');
    expect(dialogo).toHaveBeenCalled();
    expect(componente.facturas.length).toBe(cantidadInicial - 1);
  });
});
