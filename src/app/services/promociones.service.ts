/* ==========================================================================
   ARCHIVO: src/app/services/promociones.service.ts
   MÓDULO 6: Promociones, Cupones de Descuento y Fidelización
   ESTUDIANTE RESPONSABLE: Matews Abrahan Narvaez Cabeza
   TEORÍA DEL CURSO: Desarrollo de los métodos CRUD a través de variables
                     de servicios y Angular Material.
   ========================================================================== */

import { Injectable, signal } from '@angular/core';

export type EstadoCupon = 'Vigente' | 'Expirado';
export type FiltroEstadoCupon = 'Todos' | EstadoCupon;

export interface CuponPromocional {
  id: number;
  codigo: string;
  campana: string;
  descuento: number;
  usosTotales: number;
  usosDisponibles: number;
  estado: EstadoCupon;
}

export interface CampanaOferta {
  id: number;
  titulo: string;
  descripcion: string;
  alianza: string;
  descuento: number;
  codigo: string;
  diasRestantes: number;
}

const CUPONES_INICIALES: CuponPromocional[] = [
  {
    id: 1,
    codigo: 'UGVIAJA20',
    campana: 'Cyber Travel Galápagos',
    descuento: 20,
    usosTotales: 50,
    usosDisponibles: 18,
    estado: 'Vigente'
  },
  {
    id: 2,
    codigo: 'ANDES15',
    campana: 'Feriado Ruta de los Volcanes',
    descuento: 15,
    usosTotales: 100,
    usosDisponibles: 64,
    estado: 'Vigente'
  },
  {
    id: 3,
    codigo: 'SPONDY10',
    campana: 'Escapada Ruta del Spondylus',
    descuento: 10,
    usosTotales: 30,
    usosDisponibles: 30,
    estado: 'Vigente'
  },
  {
    id: 4,
    codigo: 'SELVA12',
    campana: 'Aventura en la Amazonía',
    descuento: 12,
    usosTotales: 15,
    usosDisponibles: 0,
    estado: 'Vigente'
  },
  {
    id: 5,
    codigo: 'NAVIDAD25',
    campana: 'Promo Navidad anterior',
    descuento: 25,
    usosTotales: 20,
    usosDisponibles: 7,
    estado: 'Expirado'
  }
];

const CAMPANAS_INICIALES: CampanaOferta[] = [
  {
    id: 1,
    titulo: 'Cyber Travel Galápagos',
    descripcion: 'Galápagos Imperial (5D/4N) con vuelo y hospedaje incluidos.',
    alianza: 'Banco Pacífico — Diferido sin intereses',
    descuento: 20,
    codigo: 'UGVIAJA20',
    diasRestantes: 3
  },
  {
    id: 2,
    titulo: 'Feriado Ruta de los Volcanes',
    descripcion: 'Cotopaxi, Quilotoa y Baños (3D/2N) en fechas de feriado.',
    alianza: 'Banco Pichincha — Descuento directo',
    descuento: 15,
    codigo: 'ANDES15',
    diasRestantes: 5
  },
  {
    id: 3,
    titulo: 'Escapada Ruta del Spondylus',
    descripcion: 'Montañita y Puerto López (3D/2N) con tour a Isla de la Plata.',
    alianza: 'Transferencia / Deuna',
    descuento: 10,
    codigo: 'SPONDY10',
    diasRestantes: 8
  }
];

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  // VARIABLES REACTIVAS DE SERVICIO (Signals)
  public cupones = signal<CuponPromocional[]>(structuredClone(CUPONES_INICIALES));
  public campanas = signal<CampanaOferta[]>(structuredClone(CAMPANAS_INICIALES));
  public mensajeNotificacion = signal<string>('');

  // READ: Obtener cupón por código alfanumérico
  obtenerPorCodigo(codigo: string): CuponPromocional | undefined {
    const normalizado = codigo.trim().toUpperCase();
    return this.cupones().find((c) => c.codigo.toUpperCase() === normalizado);
  }

  // READ: Estado efectivo considerando si aún le quedan usos
  estadoEfectivo(cupon: CuponPromocional): EstadoCupon {
    return cupon.usosDisponibles <= 0 ? 'Expirado' : cupon.estado;
  }

  // CREATE: Registrar un nuevo cupón en el servicio
  crearCupon(datos: Omit<CuponPromocional, 'id'>): CuponPromocional {
    const codigosExistentes = this.cupones().map((c) => c.id);
    const siguienteId = codigosExistentes.length > 0 ? Math.max(...codigosExistentes) + 1 : 1;

    const nuevo: CuponPromocional = {
      ...datos,
      id: siguienteId,
      codigo: datos.codigo.toUpperCase().trim(),
      campana: datos.campana.trim()
    };

    this.cupones.update((lista) => [nuevo, ...lista]);
    this.notificar(`Cupón "${nuevo.codigo}" registrado exitosamente.`);
    return nuevo;
  }

  // UPDATE: Modificar datos de un cupón desde el modal Dialog
  actualizarCupon(id: number, datos: Partial<CuponPromocional>): void {
    const encontrado = this.cupones().find((c) => c.id === id);
    if (!encontrado) return;

    this.cupones.update((lista) =>
      lista.map((c) => {
        if (c.id === id) {
          const modificado = { ...c, ...datos };
          if (datos.codigo) {
            modificado.codigo = datos.codigo.toUpperCase().trim();
          }
          if (datos.campana) {
            modificado.campana = datos.campana.trim();
          }
          // Si los usos disponibles llegaron a 0, pasa a Expirado
          if (modificado.usosDisponibles <= 0) {
            modificado.estado = 'Expirado';
          }
          return modificado;
        }
        return c;
      })
    );

    this.notificar(`Cupón "${encontrado.codigo}" actualizado correctamente.`);
  }

  // UPDATE RÁPIDO: Alternar entre Vigente y Expirado
  alternarEstado(id: number): void {
    const cupon = this.cupones().find((c) => c.id === id);
    if (!cupon || cupon.usosDisponibles <= 0) return;

    const nuevoEstado: EstadoCupon = cupon.estado === 'Vigente' ? 'Expirado' : 'Vigente';
    this.actualizarCupon(id, { estado: nuevoEstado });
  }

  // DELETE: Eliminar cupón del registro de la tabla
  eliminarCupon(id: number): void {
    const cupon = this.cupones().find((c) => c.id === id);
    this.cupones.update((lista) => lista.filter((c) => c.id !== id));
    this.notificar(`Cupón "${cupon?.codigo ?? id}" eliminado correctamente.`);
  }

  // CONSUMIR USO: Usado por el Módulo 4 (Cotizaciones) para aplicar descuento
  consumirUso(codigo: string): boolean {
    const cupon = this.obtenerPorCodigo(codigo);
    if (!cupon || this.estadoEfectivo(cupon) === 'Expirado') {
      return false;
    }

    const nuevosDisponibles = Math.max(0, cupon.usosDisponibles - 1);
    this.actualizarCupon(cupon.id, {
      usosDisponibles: nuevosDisponibles,
      estado: nuevosDisponibles <= 0 ? 'Expirado' : cupon.estado
    });
    return true;
  }

  // GESTIÓN DE OFERTAS Y CAMPAÑAS
  crearCampana(datos: Omit<CampanaOferta, 'id'>): CampanaOferta {
    const siguienteId = Math.max(0, ...this.campanas().map((c) => c.id)) + 1;
    const nueva: CampanaOferta = { ...datos, id: siguienteId };
    this.campanas.update((lista) => [nueva, ...lista]);
    this.notificar(`Campaña "${nueva.titulo}" publicada.`);
    return nueva;
  }

  eliminarCampana(id: number): void {
    const campana = this.campanas().find((c) => c.id === id);
    this.campanas.update((lista) => lista.filter((c) => c.id !== id));
    this.notificar(`Campaña "${campana?.titulo ?? id}" finalizada.`);
  }

  private notificar(mensaje: string): void {
    this.mensajeNotificacion.set(mensaje);
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
  }
}
