/* ==========================================================================
   ARCHIVO: src/app/components/facturacion/facturacion.component.ts
   FUNCIÓN: Módulo 5 (Danny Guaman). Facturación, control de pagos y reseñas.
            Gestión de comprobantes de venta, registro de abonos y valoraciones
            post-viaje con cálculo reactivo de KPIs e integración con reservas.
   ========================================================================== */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TabFacturacion = 'comprobantes' | 'pagos' | 'resenas';
export type EstadoFactura = 'Pagado' | 'Parcial' | 'Pendiente' | 'Anulado';
export type MetodoPago = 'Tarjeta' | 'Transferencia' | 'Abono';
export type EstadoPago = 'Confirmado' | 'En revisión';

export interface ComprobanteFactura {
  codigo: string;
  fecha: string;
  cliente: string;
  identificacion: string;
  email: string;
  paquete: string;
  pasajeros: number;
  subtotal: number;
  iva: number;
  total: number;
  montoAbonado: number;
  saldoPendiente: number;
  estado: EstadoFactura;
}

export interface RegistroPago {
  id: number;
  fecha: string;
  comprobanteCodigo: string;
  cliente: string;
  metodo: MetodoPago;
  referencia: string;
  monto: number;
  estado: EstadoPago;
}

export interface ResenaCliente {
  id: number;
  cliente: string;
  paquete: string;
  estrellas: number;
  fecha: string;
  comentario: string;
}

@Component({
  selector: 'app-modulo-facturacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class ModuloFacturacionComponent implements OnInit {
  // Pestaña activa
  tabActiva: TabFacturacion = 'comprobantes';

  // Colección de comprobantes electrónicos
  comprobantes: ComprobanteFactura[] = [
    {
      codigo: 'FAC-0001',
      fecha: '05/11/2026',
      cliente: 'María Pérez',
      identificacion: '0928374651',
      email: 'maria.perez@email.com',
      paquete: 'AND-01 Galápagos Imperial (5D/4N)',
      pasajeros: 2,
      subtotal: 1780.00,
      iva: 267.00,
      total: 2047.00,
      montoAbonado: 1000.00,
      saldoPendiente: 1047.00,
      estado: 'Parcial'
    },
    {
      codigo: 'FAC-0002',
      fecha: '08/11/2026',
      cliente: 'Carlos Mora',
      identificacion: '1719283746',
      email: 'carlos.mora@email.com',
      paquete: 'AND-03 Cuyabeno Amazónico (4D/3N)',
      pasajeros: 3,
      subtotal: 1140.00,
      iva: 171.00,
      total: 1311.00,
      montoAbonado: 1311.00,
      saldoPendiente: 0.00,
      estado: 'Pagado'
    },
    {
      codigo: 'FAC-0003',
      fecha: '10/11/2026',
      cliente: 'Lucía Vera',
      identificacion: '0954321876',
      email: 'lucia.vera@email.com',
      paquete: 'AND-04 Sol y Playa Salinas (3D/2N)',
      pasajeros: 4,
      subtotal: 740.00,
      iva: 111.00,
      total: 851.00,
      montoAbonado: 200.00,
      saldoPendiente: 651.00,
      estado: 'Pendiente'
    }
  ];

  // Comprobante actualmente visible en el voucher
  comprobanteSeleccionado: ComprobanteFactura = this.comprobantes[0];

  // Historial de transacciones de pago
  pagos: RegistroPago[] = [
    {
      id: 1,
      fecha: '05/11/2026',
      comprobanteCodigo: 'FAC-0001',
      cliente: 'María Pérez',
      metodo: 'Tarjeta',
      referencia: 'TX-994821',
      monto: 1000.00,
      estado: 'Confirmado'
    },
    {
      id: 2,
      fecha: '08/11/2026',
      comprobanteCodigo: 'FAC-0002',
      cliente: 'Carlos Mora',
      metodo: 'Transferencia',
      referencia: 'DEP-BCO-83921',
      monto: 1311.00,
      estado: 'Confirmado'
    },
    {
      id: 3,
      fecha: '10/11/2026',
      comprobanteCodigo: 'FAC-0003',
      cliente: 'Lucía Vera',
      metodo: 'Abono',
      referencia: 'ABN-CAJA-004',
      monto: 200.00,
      estado: 'En revisión'
    }
  ];

  // Reseñas y calificaciones de clientes
  resenas: ResenaCliente[] = [
    {
      id: 1,
      cliente: 'María Pérez',
      paquete: 'AND-01 Galápagos Imperial',
      estrellas: 5,
      fecha: '06/11/2026',
      comentario: 'Excelente organización y guías muy atentos durante todo el recorrido.'
    },
    {
      id: 2,
      cliente: 'Carlos Mora',
      paquete: 'AND-03 Aventura Amazónica',
      estrellas: 5,
      fecha: '09/11/2026',
      comentario: 'El lodge y el transporte fueron tal como se ofrecieron. Volvería a viajar con ellos.'
    },
    {
      id: 3,
      cliente: 'Lucía Vera',
      paquete: 'AND-04 Sol y Playa',
      estrellas: 4,
      fecha: '11/11/2026',
      comentario: 'Muy buena experiencia. Solo mejoraría la puntualidad de la salida.'
    }
  ];

  // Filtros reactivos
  filtroBusqueda: string = '';
  filtroEstado: string = 'Todos';
  filtroMetodoPago: string = 'Todos';

  // Formulario de nuevo pago / abono
  pagoNuevo = {
    comprobanteCodigo: 'FAC-0001',
    metodo: 'Tarjeta' as MetodoPago,
    referencia: '',
    monto: 0
  };

  // Formulario de nueva reseña
  nuevaResena = {
    cliente: '',
    paquete: 'AND-01 Galápagos Imperial',
    estrellas: 5,
    comentario: ''
  };

  // Avisos de confirmación
  mensajeAlerta: string | null = null;
  tipoAlerta: 'success' | 'warning' | 'info' = 'success';

  ngOnInit(): void {
    // Sincronizar reservas almacenadas en sessionStorage si existen
    this.cargarReservasDesdeStorage();
    if (this.comprobantes.length > 0) {
      this.comprobanteSeleccionado = this.comprobantes[0];
      this.pagoNuevo.comprobanteCodigo = this.comprobanteSeleccionado.codigo;
      this.pagoNuevo.monto = this.comprobanteSeleccionado.saldoPendiente;
    }
  }

  // Permite sincronizar con cotizaciones/reservas previas
  private cargarReservasDesdeStorage(): void {
    try {
      const data = sessionStorage.getItem('andestravel_reservas_2026');
      if (data) {
        const reservas = JSON.parse(data);
        if (Array.isArray(reservas)) {
          reservas.forEach((res, index) => {
            const codigo = `FAC-RES-${String(index + 1).padStart(3, '0')}`;
            if (!this.comprobantes.some((c) => c.codigo === codigo)) {
              const total = res.total || 1200;
              const subtotal = Math.round((total / 1.15) * 100) / 100;
              const iva = Math.round((total - subtotal) * 100) / 100;
              this.comprobantes.push({
                codigo,
                fecha: new Date().toLocaleDateString('es-EC'),
                cliente: res.titular || 'Cliente Reserva',
                identificacion: '0999999999',
                email: 'reserva@andestravel.com',
                paquete: res.destino || 'Paquete Seleccionado',
                pasajeros: res.pasajeros || 2,
                subtotal,
                iva,
                total,
                montoAbonado: res.estado === 'Confirmada' ? total : 0,
                saldoPendiente: res.estado === 'Confirmada' ? 0 : total,
                estado: res.estado === 'Confirmada' ? 'Pagado' : 'Pendiente'
              });
            }
          });
        }
      }
    } catch {
      // Ignorar fallas de lectura de storage
    }
  }

  // Cambio de pestañas principales
  seleccionarTab(tab: TabFacturacion): void {
    this.tabActiva = tab;
    this.mensajeAlerta = null;
  }

  // Selección de comprobante para el voucher
  seleccionarComprobante(comprobante: ComprobanteFactura): void {
    this.comprobanteSeleccionado = comprobante;
    this.pagoNuevo.comprobanteCodigo = comprobante.codigo;
    this.pagoNuevo.monto = comprobante.saldoPendiente;
  }

  // Filtrado de comprobantes
  comprobantesFiltrados(): ComprobanteFactura[] {
    const texto = this.filtroBusqueda.trim().toLowerCase();
    return this.comprobantes.filter((c) => {
      const coincideTexto =
        texto === '' ||
        c.codigo.toLowerCase().includes(texto) ||
        c.cliente.toLowerCase().includes(texto) ||
        c.paquete.toLowerCase().includes(texto);
      const coincideEstado = this.filtroEstado === 'Todos' || c.estado === this.filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }

  // Filtrado de pagos
  pagosFiltrados(): RegistroPago[] {
    return this.pagos.filter((p) => {
      return this.filtroMetodoPago === 'Todos' || p.metodo === this.filtroMetodoPago;
    });
  }

  // Cálculos dinámicos de KPIs
  totalFacturado(): number {
    return this.comprobantes
      .filter((c) => c.estado !== 'Anulado')
      .reduce((sum, c) => sum + c.total, 0);
  }

  totalAbonado(): number {
    return this.pagos
      .filter((p) => p.estado === 'Confirmado')
      .reduce((sum, p) => sum + p.monto, 0);
  }

  saldoPendienteTotal(): number {
    return this.comprobantes
      .filter((c) => c.estado !== 'Anulado')
      .reduce((sum, c) => sum + c.saldoPendiente, 0);
  }

  promedioSatisfaccion(): number {
    if (this.resenas.length === 0) return 5.0;
    const suma = this.resenas.reduce((acc, r) => acc + r.estrellas, 0);
    return Math.round((suma / this.resenas.length) * 10) / 10;
  }

  conteoPorEstrellas(estrellas: number): number {
    return this.resenas.filter((r) => r.estrellas === estrellas).length;
  }

  porcentajeEstrellas(estrellas: number): number {
    if (this.resenas.length === 0) return 0;
    return Math.round((this.conteoPorEstrellas(estrellas) / this.resenas.length) * 100);
  }

  porcentajePago(comprobante: ComprobanteFactura): number {
    if (comprobante.total <= 0) return 0;
    const pct = Math.round((comprobante.montoAbonado / comprobante.total) * 100);
    return Math.min(100, Math.max(0, pct));
  }

  // Procesamiento de pago / abono
  registrarPago(): void {
    const comp = this.comprobantes.find((c) => c.codigo === this.pagoNuevo.comprobanteCodigo);
    if (!comp) {
      this.mostrarAlerta('Comprobante no encontrado.', 'warning');
      return;
    }

    const monto = Number(this.pagoNuevo.monto);
    if (monto <= 0) {
      this.mostrarAlerta('Ingresa un monto válido mayor a cero.', 'warning');
      return;
    }

    if (monto > comp.saldoPendiente + 0.01) {
      this.mostrarAlerta(`El monto ($${monto.toFixed(2)}) supera el saldo pendiente ($${comp.saldoPendiente.toFixed(2)}).`, 'warning');
      return;
    }

    const nuevoId = this.pagos.length + 1;
    const ref = this.pagoNuevo.referencia.trim() || `TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const nuevoPago: RegistroPago = {
      id: nuevoId,
      fecha: new Date().toLocaleDateString('es-EC'),
      comprobanteCodigo: comp.codigo,
      cliente: comp.cliente,
      metodo: this.pagoNuevo.metodo,
      referencia: ref,
      monto,
      estado: 'Confirmado'
    };

    this.pagos.unshift(nuevoPago);

    // Actualizar saldo de la factura
    comp.montoAbonado = Math.min(comp.total, comp.montoAbonado + monto);
    comp.saldoPendiente = Math.max(0, Math.round((comp.total - comp.montoAbonado) * 100) / 100);

    if (comp.saldoPendiente === 0) {
      comp.estado = 'Pagado';
    } else {
      comp.estado = 'Parcial';
    }

    // Actualizar formulario
    this.pagoNuevo.monto = comp.saldoPendiente;
    this.pagoNuevo.referencia = '';
    this.mostrarAlerta(`¡Abono de $${monto.toFixed(2)} registrado con éxito para ${comp.codigo}!`, 'success');
  }

  // Registro de nueva reseña
  registrarResena(): void {
    if (!this.nuevaResena.cliente.trim() || !this.nuevaResena.comentario.trim()) {
      this.mostrarAlerta('Por favor ingresa tu nombre y un comentario para la reseña.', 'warning');
      return;
    }

    const resena: ResenaCliente = {
      id: this.resenas.length + 1,
      cliente: this.nuevaResena.cliente.trim(),
      paquete: this.nuevaResena.paquete,
      estrellas: this.nuevaResena.estrellas,
      fecha: new Date().toLocaleDateString('es-EC'),
      comentario: this.nuevaResena.comentario.trim()
    };

    this.resenas.unshift(resena);
    this.nuevaResena.cliente = '';
    this.nuevaResena.comentario = '';
    this.nuevaResena.estrellas = 5;
    this.mostrarAlerta('¡Muchas gracias! Tu reseña ha sido publicada con éxito.', 'success');
  }

  setCalificacion(estrellas: number): void {
    this.nuevaResena.estrellas = estrellas;
  }

  // Acciones sobre comprobante
  imprimirVoucher(): void {
    window.print();
  }

  descargarPdf(): void {
    this.mostrarAlerta(`Descargando comprobante oficial ${this.comprobanteSeleccionado.codigo} en formato PDF...`, 'info');
  }

  anularComprobante(comp: ComprobanteFactura): void {
    if (confirm(`¿Estás seguro de anular el comprobante ${comp.codigo}?`)) {
      comp.estado = 'Anulado';
      comp.saldoPendiente = 0;
      this.mostrarAlerta(`El comprobante ${comp.codigo} ha sido anulado.`, 'info');
    }
  }

  private mostrarAlerta(mensaje: string, tipo: 'success' | 'warning' | 'info'): void {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
  }

  cerrarAlerta(): void {
    this.mensajeAlerta = null;
  }
}

// Alias de compatibilidad
export { ModuloFacturacionComponent as FacturacionComponent };
