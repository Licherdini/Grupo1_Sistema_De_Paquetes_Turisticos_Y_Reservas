import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloFacturacionComponent } from './facturacion.component';
import { FormsModule } from '@angular/forms';

describe('ModuloFacturacionComponent (Módulo 5: Facturación)', () => {
  let component: ModuloFacturacionComponent;
  let fixture: ComponentFixture<ModuloFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloFacturacionComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con la pestaña de comprobantes activa y con datos iniciales', () => {
    expect(component.tabActiva).toBe('comprobantes');
    expect(component.comprobantes.length).toBeGreaterThanOrEqual(3);
    expect(component.comprobanteSeleccionado).toBeDefined();
  });

  it('debe calcular los KPIs reactivos dinámicamente', () => {
    const total = component.totalFacturado();
    const abonado = component.totalAbonado();
    const saldo = component.saldoPendienteTotal();

    expect(total).toBeGreaterThan(0);
    expect(abonado).toBeGreaterThan(0);
    expect(saldo).toBeGreaterThanOrEqual(0);
    expect(component.promedioSatisfaccion()).toBeGreaterThan(0);
  });

  it('debe alternar entre pestañas correctamente', () => {
    component.seleccionarTab('pagos');
    expect(component.tabActiva).toBe('pagos');

    component.seleccionarTab('resenas');
    expect(component.tabActiva).toBe('resenas');

    component.seleccionarTab('comprobantes');
    expect(component.tabActiva).toBe('comprobantes');
  });

  it('debe filtrar comprobantes por texto y por estado', () => {
    component.filtroBusqueda = 'María';
    const filtrados = component.comprobantesFiltrados();
    expect(filtrados.length).toBe(1);
    expect(filtrados[0].cliente).toBe('María Pérez');

    component.filtroBusqueda = '';
    component.filtroEstado = 'Pagado';
    expect(component.comprobantesFiltrados().every((c) => c.estado === 'Pagado')).toBe(true);
  });

  it('debe permitir seleccionar un comprobante para el voucher interactivo', () => {
    const segundo = component.comprobantes[1];
    component.seleccionarComprobante(segundo);
    expect(component.comprobanteSeleccionado.codigo).toBe(segundo.codigo);
  });

  it('debe registrar un abono exitosamente y actualizar el saldo de la factura', () => {
    const comp = component.comprobantes[0]; // FAC-0001 (Parcial, saldo pendiente 1047)
    const saldoAnterior = comp.saldoPendiente;
    const pagosIniciales = component.pagos.length;

    component.pagoNuevo = {
      comprobanteCodigo: comp.codigo,
      metodo: 'Tarjeta',
      referencia: 'TX-TEST-01',
      monto: 200
    };

    component.registrarPago();

    expect(component.pagos.length).toBe(pagosIniciales + 1);
    expect(comp.saldoPendiente).toBe(saldoAnterior - 200);
    expect(comp.montoAbonado).toBeGreaterThan(0);
  });

  it('debe publicar una reseña y actualizar el promedio de satisfacción', () => {
    const totalInicial = component.resenas.length;

    component.nuevaResena = {
      cliente: 'Andrés López',
      paquete: 'AND-01 Galápagos Imperial',
      estrellas: 5,
      comentario: 'Viaje inolvidable, todo de primera calidad.'
    };

    component.registrarResena();

    expect(component.resenas.length).toBe(totalInicial + 1);
    expect(component.resenas[0].cliente).toBe('Andrés López');
    expect(component.promedioSatisfaccion()).toBeGreaterThan(0);
  });
});
