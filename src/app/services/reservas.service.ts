import { Injectable, signal } from '@angular/core';

export interface PaqueteCotizable {
  id: string;
  nombre: string;
  region: string;
  duracion: string;
  precioBase: number;
  cuposDisponibles: number;
}

export interface PreReserva {
  codigo: string;
  cliente: string;
  paqueteId: string;
  paqueteNombre: string;
  region: string;
  fechaSalida: string;
  temporada: string;
  pasajeros: number;
  total: number;
  estado: 'Confirmada' | 'Pendiente' | 'Modificada';
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  // Catálogo base de paquetes turísticos
  public paquetes = signal<PaqueteCotizable[]>([
    {
      id: 'PKG-GAL-01',
      nombre: 'Galápagos Imperial (5D/4N)',
      region: 'Insular',
      duracion: '5 días / 4 noches',
      precioBase: 674,
      cuposDisponibles: 12
    },
    {
      id: 'PKG-SIE-02',
      nombre: 'Ruta de los Volcanes: Cotopaxi, Quilotoa y Baños',
      region: 'Sierra',
      duracion: '3 días / 2 noches',
      precioBase: 260,
      cuposDisponibles: 18
    },
    {
      id: 'PKG-AMA-03',
      nombre: 'Expedición Amazónica: Tena y Cuyabeno',
      region: 'Amazonía',
      duracion: '4 días / 3 noches',
      precioBase: 340,
      cuposDisponibles: 10
    },
    {
      id: 'PKG-COS-04',
      nombre: 'Ruta del Spondylus: Montañita y Puerto López',
      region: 'Costa',
      duracion: '3 días / 2 noches',
      precioBase: 210,
      cuposDisponibles: 15
    }
  ]);

  // Colección reactiva de reservas registradas
  public reservas = signal<PreReserva[]>([
    {
      codigo: 'RES-2026-01',
      cliente: 'CLIENTE CORPORATIVO UG',
      paqueteId: 'PKG-GAL-01',
      paqueteNombre: 'Galápagos Imperial (5D/4N)',
      region: 'Insular',
      fechaSalida: '2026-12-15',
      temporada: 'Media',
      pasajeros: 2,
      total: 1398,
      estado: 'Confirmada'
    }
  ]);

  public mensajeNotificacion = signal<string>('');

  // CREATE: Registrar nueva reserva y bloquear cupos correspondientes
  public registrarReserva(datos: {
    cliente: string;
    paqueteId: string;
    fechaSalida: string;
    temporada: string;
    pasajeros: number;
    total: number;
  }): PreReserva {
    const paquete = this.paquetes().find((p) => p.id === datos.paqueteId) ?? this.paquetes()[0];
    const consecutivo = String(this.reservas().length + 1).padStart(2, '0');
    const codigo = `RES-2026-${consecutivo}`;

    const nueva: PreReserva = {
      codigo,
      cliente: datos.cliente.toUpperCase(),
      paqueteId: paquete.id,
      paqueteNombre: paquete.nombre,
      region: paquete.region,
      fechaSalida: datos.fechaSalida,
      temporada: datos.temporada,
      pasajeros: datos.pasajeros,
      total: datos.total,
      estado: 'Confirmada'
    };

    // Descuenta cupos del paquete
    this.paquetes.update((lista) =>
      lista.map((p) => 
        p.id === paquete.id 
          ? { ...p, cuposDisponibles: Math.max(0, p.cuposDisponibles - datos.pasajeros) } 
          : p
      )
    );

    this.reservas.update((lista) => [nueva, ...lista]);
    this.mensajeNotificacion.set(`Reserva ${codigo} creada exitosamente.`);
    return nueva;
  }

  // UPDATE: Modificar datos de una reserva existente
  public actualizarReserva(codigo: string, nuevosPasajeros: number, nuevoEstado: 'Confirmada' | 'Pendiente' | 'Modificada'): void {
    this.reservas.update((lista) =>
      lista.map((r) => (r.codigo === codigo ? { ...r, pasajeros: nuevosPasajeros, estado: nuevoEstado } : r))
    );
    this.mensajeNotificacion.set(`Reserva ${codigo} actualizada correctamente.`);
  }

  // DELETE: Eliminar reserva y reintegrar cupos al inventario
  public eliminarReserva(codigo: string): void {
    const encontrada = this.reservas().find((r) => r.codigo === codigo);
    if (encontrada) {
      this.paquetes.update((lista) =>
        lista.map((p) => 
          p.id === encontrada.paqueteId 
            ? { ...p, cuposDisponibles: p.cuposDisponibles + encontrada.pasajeros } 
            : p
        )
      );
    }
    this.reservas.update((lista) => lista.filter((r) => r.codigo !== codigo));
    this.mensajeNotificacion.set(`Reserva ${codigo} eliminada y cupos liberados.`);
  }
}