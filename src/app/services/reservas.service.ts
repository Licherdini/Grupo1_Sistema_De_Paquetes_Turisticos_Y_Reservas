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
      nombre: 'Ruta de los Volcanes: Cotopaxi, Quilotoa y Baños (3D/2N)',
      region: 'Sierra',
      duracion: '3 días / 2 noches',
      precioBase: 260,
      cuposDisponibles: 18
    },
    {
      id: 'PKG-AMA-03',
      nombre: 'Expedición Amazónica: Tena y Cuyabeno (4D/3N)',
      region: 'Amazonía',
      duracion: '4 días / 3 noches',
      precioBase: 340,
      cuposDisponibles: 10
    },
    {
      id: 'PKG-COS-04',
      nombre: 'Ruta del Spondylus: Montañita y Puerto López (3D/2N)',
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

    // Calcula el próximo consecutivo usando el máximo existente (evita duplicados al eliminar)
    const codigosExistentes = this.reservas().map((r) => {
      const partes = r.codigo.split('-');
      return parseInt(partes[partes.length - 1], 10) || 0;
    });
    const siguiente = codigosExistentes.length > 0 ? Math.max(...codigosExistentes) + 1 : 1;
    const codigo = `RES-2026-${String(siguiente).padStart(2, '0')}`;

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
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
    return nueva;
  }

  // UPDATE: Modificar datos de una reserva existente, recalculando el total y ajustando cupos
  public actualizarReserva(codigo: string, nuevosPasajeros: number, nuevoEstado: 'Confirmada' | 'Pendiente' | 'Modificada'): void {
    const reservaActual = this.reservas().find((r) => r.codigo === codigo);
    if (!reservaActual) return;

    const paquete = this.paquetes().find((p) => p.id === reservaActual.paqueteId);
    if (!paquete) return;

    const diferenciaPasajeros = nuevosPasajeros - reservaActual.pasajeros;
    const cuposLiberados = diferenciaPasajeros < 0 ? Math.abs(diferenciaPasajeros) : 0;
    const cuposNecesarios = diferenciaPasajeros > 0 ? diferenciaPasajeros : 0;

    // Validar que haya cupos suficientes si se aumentan pasajeros
    if (cuposNecesarios > paquete.cuposDisponibles) {
      this.mensajeNotificacion.set(
        `No hay cupos suficientes. Disponibles: ${paquete.cuposDisponibles}, solicitados adicionales: ${cuposNecesarios}.`
      );
      return;
    }

    // Recalcular el total con el mismo precio base y temporada
    const factorTemporada =
      reservaActual.temporada === 'Baja' ? 0.9 : reservaActual.temporada === 'Alta' ? 1.2 : 1.0;
    const nuevoTotal = paquete.precioBase * nuevosPasajeros * factorTemporada;

    // Ajustar cupos en el paquete
    this.paquetes.update((lista) =>
      lista.map((p) =>
        p.id === reservaActual.paqueteId
          ? {
              ...p,
              cuposDisponibles: p.cuposDisponibles + cuposLiberados - cuposNecesarios
            }
          : p
      )
    );

    this.reservas.update((lista) =>
      lista.map((r) =>
        r.codigo === codigo
          ? { ...r, pasajeros: nuevosPasajeros, estado: nuevoEstado, total: nuevoTotal }
          : r
      )
    );
    this.mensajeNotificacion.set(
      `Reserva ${codigo} de "${reservaActual.cliente}" (${paquete.nombre}) actualizada correctamente: ${nuevosPasajeros} pasajeros, Estado: ${nuevoEstado}, Total recalculado: $${nuevoTotal.toFixed(2)}.`
    );
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
  }

  // UPDATE COMPLETO: Modificar todos los campos de una reserva desde el diálogo modal
  public actualizarReservaCompleta(codigo: string, datosActualizados: PreReserva): void {
    const reservaActual = this.reservas().find((r) => r.codigo === codigo);
    if (!reservaActual) return;

    // Si cambió el paquete o los pasajeros, ajustamos cupos en el catálogo
    const paqueteAnterior = this.paquetes().find((p) => p.id === reservaActual.paqueteId);
    const paqueteNuevo = this.paquetes().find((p) => p.id === datosActualizados.paqueteId);

    if (paqueteAnterior && paqueteNuevo) {
      if (paqueteAnterior.id === paqueteNuevo.id) {
        const diferencia = datosActualizados.pasajeros - reservaActual.pasajeros;
        this.paquetes.update((lista) =>
          lista.map((p) =>
            p.id === paqueteNuevo.id
              ? { ...p, cuposDisponibles: Math.max(0, p.cuposDisponibles - diferencia) }
              : p
          )
        );
      } else {
        // Liberar cupos del paquete anterior y descontar del nuevo
        this.paquetes.update((lista) =>
          lista.map((p) => {
            if (p.id === paqueteAnterior.id) {
              return { ...p, cuposDisponibles: p.cuposDisponibles + reservaActual.pasajeros };
            }
            if (p.id === paqueteNuevo.id) {
              return { ...p, cuposDisponibles: Math.max(0, p.cuposDisponibles - datosActualizados.pasajeros) };
            }
            return p;
          })
        );
      }
    }

    this.reservas.update((lista) =>
      lista.map((r) => (r.codigo === codigo ? { ...datosActualizados } : r))
    );

    this.mensajeNotificacion.set(
      `Reserva ${codigo} de "${datosActualizados.cliente}" (${datosActualizados.paqueteNombre}) actualizada correctamente: ${datosActualizados.pasajeros} pax, Estado: ${datosActualizados.estado}, Total: $${datosActualizados.total.toFixed(2)}.`
    );
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
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
    this.mensajeNotificacion.set(
      `Reserva ${codigo} de "${encontrada?.cliente ?? codigo}" (${encontrada?.paqueteNombre ?? 'Paquete'}) eliminada y cupos liberados.`
    );
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
  }
}
