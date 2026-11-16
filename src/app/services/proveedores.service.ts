/* ==========================================================================
   ARCHIVO: src/app/services/proveedores.service.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Servicio Angular con signals que actúa como fuente única de datos
            para el directorio de convenios con aerolíneas y transporte terrestre.
            Expone métodos CRUD: crear, leer (filtrado), actualizar y eliminar.
   ========================================================================== */

import { Injectable, signal, computed } from '@angular/core';

export type TipoProveedor = 'Aerolínea' | 'Transporte Terrestre';
export type EstadoConvenio = 'Activo' | 'Suspendido' | 'En Renovación';

export interface ConvenioProveedor {
  id: number;
  nombre: string;
  tipo: TipoProveedor;
  ciudad: string;
  tarifaCorporativa: number;
  unidadTarifa: 'por trayecto' | 'por persona';
  frecuencias: string;
  estado: EstadoConvenio;
  logoIniciales: string;
}

export interface BorradorProveedor {
  nombre: string;
  tipo: TipoProveedor;
  ciudad: string;
  tarifaCorporativa: number | null;
  unidadTarifa: 'por trayecto' | 'por persona';
  frecuencias: string;
  estado: EstadoConvenio;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  // ── Señal reactiva: colección de convenios ────────────────────────────────
  public proveedores = signal<ConvenioProveedor[]>([
    {
      id: 1,
      nombre: 'LATAM Airlines Ecuador',
      tipo: 'Aerolínea',
      ciudad: 'Galápagos',
      tarifaCorporativa: 189,
      unidadTarifa: 'por trayecto',
      frecuencias: 'Lun, Mié, Vie — UIO/GPS directo',
      estado: 'Activo',
      logoIniciales: 'LA'
    },
    {
      id: 2,
      nombre: 'Avianca Ecuador',
      tipo: 'Aerolínea',
      ciudad: 'Cuenca',
      tarifaCorporativa: 75,
      unidadTarifa: 'por trayecto',
      frecuencias: 'Diario — UIO/CUE',
      estado: 'Activo',
      logoIniciales: 'AV'
    },
    {
      id: 3,
      nombre: 'TransTurismo Baños S.A.',
      tipo: 'Transporte Terrestre',
      ciudad: 'Baños',
      tarifaCorporativa: 12,
      unidadTarifa: 'por persona',
      frecuencias: 'Sáb y Dom — Salida 07:00 desde Quito',
      estado: 'Activo',
      logoIniciales: 'TB'
    },
    {
      id: 4,
      nombre: 'Ruta Spondylus Express',
      tipo: 'Transporte Terrestre',
      ciudad: 'Montañita',
      tarifaCorporativa: 18,
      unidadTarifa: 'por persona',
      frecuencias: 'Vie y Sáb — Salida 06:30 desde Guayaquil',
      estado: 'En Renovación',
      logoIniciales: 'RS'
    },
    {
      id: 5,
      nombre: 'Aerogal Cargo & Pasajeros',
      tipo: 'Aerolínea',
      ciudad: 'Manta',
      tarifaCorporativa: 95,
      unidadTarifa: 'por trayecto',
      frecuencias: 'Mar, Jue — UIO/MEC',
      estado: 'Suspendido',
      logoIniciales: 'AG'
    },
    {
      id: 6,
      nombre: 'Cooperativa Flota Imbabura',
      tipo: 'Transporte Terrestre',
      ciudad: 'Ambato',
      tarifaCorporativa: 8,
      unidadTarifa: 'por persona',
      frecuencias: 'Lun a Vie — Salida 08:00 desde Quito',
      estado: 'Activo',
      logoIniciales: 'FI'
    }
  ]);

  // Señal para mensajes de retroalimentación al usuario
  public mensajeNotificacion = signal<string>('');

  // ── READ: total de registros (computed) ───────────────────────────────────
  public totalProveedores = computed(() => this.proveedores().length);

  // ── CREATE: Registrar nuevo convenio de proveedor ─────────────────────────
  public registrarProveedor(borrador: BorradorProveedor): ConvenioProveedor {
    const siguiente = Math.max(0, ...this.proveedores().map((p) => p.id)) + 1;
    const iniciales = borrador.nombre
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const nuevo: ConvenioProveedor = {
      id: siguiente,
      nombre: borrador.nombre.trim(),
      tipo: borrador.tipo,
      ciudad: borrador.ciudad,
      tarifaCorporativa: Number(borrador.tarifaCorporativa),
      unidadTarifa: borrador.unidadTarifa,
      frecuencias: borrador.frecuencias.trim() || 'Sin especificar',
      estado: borrador.estado,
      logoIniciales: iniciales
    };

    this.proveedores.update((lista) => [nuevo, ...lista]);
    this.mensajeNotificacion.set(`✅ Proveedor "${nuevo.nombre}" registrado correctamente.`);
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
    return nuevo;
  }

  // ── UPDATE: Modificar convenio existente ──────────────────────────────────
  public actualizarProveedor(id: number, cambios: Partial<ConvenioProveedor>): void {
    this.proveedores.update((lista) =>
      lista.map((p) => (p.id === id ? { ...p, ...cambios } : p))
    );
    this.mensajeNotificacion.set(`✏️ Convenio actualizado correctamente.`);
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
  }

  // ── DELETE: Eliminar convenio del directorio ──────────────────────────────
  public eliminarProveedor(id: number): void {
    const encontrado = this.proveedores().find((p) => p.id === id);
    this.proveedores.update((lista) => lista.filter((p) => p.id !== id));
    this.mensajeNotificacion.set(
      `🗑️ Proveedor "${encontrado?.nombre ?? id}" eliminado del directorio.`
    );
    setTimeout(() => this.mensajeNotificacion.set(''), 4500);
  }

  // ── Helpers de UI ─────────────────────────────────────────────────────────
  public claseBadgeEstado(estado: EstadoConvenio): string {
    const mapa: Record<EstadoConvenio, string> = {
      'Activo': 'bg-success-subtle text-success-emphasis',
      'Suspendido': 'bg-danger-subtle text-danger-emphasis',
      'En Renovación': 'bg-warning-subtle text-warning-emphasis'
    };
    return mapa[estado];
  }

  public claseBadgeTipo(tipo: TipoProveedor): string {
    return tipo === 'Aerolínea'
      ? 'bg-info-subtle text-info-emphasis'
      : 'bg-secondary-subtle text-secondary-emphasis';
  }

  public iconoTipo(tipo: TipoProveedor): string {
    return tipo === 'Aerolínea' ? '✈️' : '🚌';
  }
}
