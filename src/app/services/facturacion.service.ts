/* ==========================================================================
   ARCHIVO: src/app/services/facturacion.service.ts
   FUNCIÓN: Módulo 5. Servicio con signal para el CRUD de facturas (comprobantes
            electrónicos). Los datos viven en un signal y se exponen con métodos
            obtener / agregar / actualizar / eliminar.
   ========================================================================== */

import { Injectable, signal } from '@angular/core';

export type EstadoPagoFactura = 'Pagado' | 'Pendiente' | 'Anulado';

export interface Factura {
  idFactura: string;
  cliente: string;
  paqueteTuristico: string;
  montoTotal: number;
  estadoPago: EstadoPagoFactura;
  fechaEmision: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {
  // Signal de retroalimentación inline (mensaje temporal para el usuario)
  readonly mensajeNotificacion = signal<string>('');

  // Signal con los registros iniciales coherentes con la agencia AndesTravel
  readonly comprobantesSignal = signal<Factura[]>([
    {
      idFactura: 'FAC-0001',
      cliente: 'María Pérez',
      paqueteTuristico: 'AND-01 Galápagos Imperial (5D/4N)',
      montoTotal: 2047.00,
      estadoPago: 'Pagado',
      fechaEmision: '2026-11-05'
    },
    {
      idFactura: 'FAC-0002',
      cliente: 'Carlos Mora',
      paqueteTuristico: 'AND-03 Cuyabeno Amazónico (4D/3N)',
      montoTotal: 1311.00,
      estadoPago: 'Pagado',
      fechaEmision: '2026-11-08'
    },
    {
      idFactura: 'FAC-0003',
      cliente: 'Lucía Vera',
      paqueteTuristico: 'AND-04 Sol y Playa Salinas (3D/2N)',
      montoTotal: 851.00,
      estadoPago: 'Pendiente',
      fechaEmision: '2026-11-10'
    },
    {
      idFactura: 'FAC-0004',
      cliente: 'Andrés López',
      paqueteTuristico: 'AND-02 Ruta de los Volcanes (4D/3N)',
      montoTotal: 1560.00,
      estadoPago: 'Anulado',
      fechaEmision: '2026-11-12'
    }
  ]);

  obtenerFacturas(): Factura[] {
    return this.comprobantesSignal();
  }

  agregarFactura(nueva: Factura): void {
    this.comprobantesSignal.update(lista => [...lista, nueva]);
  }

  actualizarFactura(id: string, actualizada: Partial<Factura>): void {
    this.comprobantesSignal.update(lista =>
      lista.map(f => f.idFactura === id ? { ...f, ...actualizada } : f)
    );
  }

  eliminarFactura(id: string): void {
    this.comprobantesSignal.update(lista => lista.filter(f => f.idFactura !== id));
  }
}
