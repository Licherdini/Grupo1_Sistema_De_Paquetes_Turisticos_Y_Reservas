/* ==========================================================================
   ARCHIVO: proveedores-directorio.component.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Sección "Directorio de Proveedores" (/proveedores/directorio).
            CRUD en memoria de convenios con aerolíneas y transporte terrestre.
            Incluye filtros por tipo, ciudad y estado del convenio.
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-proveedores-directorio',
  styleUrl: './proveedores-directorio.component.css',
  templateUrl: './proveedores-directorio.component.html',
})
export class ProveedoresDirectorioComponent {
  readonly tiposProveedor: TipoProveedor[] = ['Aerolínea', 'Transporte Terrestre'];
  readonly estadosConvenio: EstadoConvenio[] = ['Activo', 'Suspendido', 'En Renovación'];
  readonly ciudadesDestino: string[] = [
    'Galápagos', 'Cuenca', 'Baños', 'Manta', 'Loja',
    'Esmeraldas', 'Ambato', 'Quito', 'Guayaquil', 'Montañita'
  ];
  readonly unidades: Array<'por trayecto' | 'por persona'> = ['por trayecto', 'por persona'];

  // Filtros
  filtroTexto: string = '';
  filtroCiudad: string = 'Todas';
  filtroTipo: string = 'Todos';
  filtroEstado: string = 'Todos';

  // Control de edición inline
  proveedorEditandoId = signal<number | null>(null);
  borradorEdicion = signal<Partial<ConvenioProveedor>>({});
  mensajeSimulacion = signal<string>('');
  confirmandoEliminacionId = signal<number | null>(null);

  // Formulario de creación
  mostrarFormulario: boolean = false;
  nuevoProveedor: BorradorProveedor = this.crearBorrador();

  proveedores: ConvenioProveedor[] = [
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
    }
  ];

  // ── READ: filtrado combinado ──────────────────────────────────────────────
  proveedoresFiltrados(): ConvenioProveedor[] {
    const texto = this.filtroTexto.trim().toLowerCase();
    return this.proveedores.filter((p) => {
      const coincideTexto =
        texto === '' ||
        p.nombre.toLowerCase().includes(texto) ||
        p.ciudad.toLowerCase().includes(texto);
      const coincideCiudad = this.filtroCiudad === 'Todas' || p.ciudad === this.filtroCiudad;
      const coincideTipo = this.filtroTipo === 'Todos' || p.tipo === this.filtroTipo;
      const coincideEstado = this.filtroEstado === 'Todos' || p.estado === this.filtroEstado;
      return coincideTexto && coincideCiudad && coincideTipo && coincideEstado;
    });
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  formularioValido(): boolean {
    const p = this.nuevoProveedor;
    return (
      p.nombre.trim().length >= 4 &&
      this.ciudadesDestino.includes(p.ciudad) &&
      (p.tarifaCorporativa ?? 0) > 0
    );
  }

  registrarProveedor(): void {
    if (!this.formularioValido()) return;
    const siguiente = Math.max(0, ...this.proveedores.map((p) => p.id)) + 1;
    const iniciales = this.nuevoProveedor.nombre
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    const nuevo: ConvenioProveedor = {
      id: siguiente,
      nombre: this.nuevoProveedor.nombre.trim(),
      tipo: this.nuevoProveedor.tipo,
      ciudad: this.nuevoProveedor.ciudad,
      tarifaCorporativa: Number(this.nuevoProveedor.tarifaCorporativa),
      unidadTarifa: this.nuevoProveedor.unidadTarifa,
      frecuencias: this.nuevoProveedor.frecuencias.trim() || 'Sin especificar',
      estado: this.nuevoProveedor.estado,
      logoIniciales: iniciales
    };
    this.proveedores = [nuevo, ...this.proveedores];
    this.nuevoProveedor = this.crearBorrador();
    this.mostrarFormulario = false;
    this.mensajeSimulacion.set(`✅ Proveedor "${nuevo.nombre}" registrado correctamente.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  iniciarEdicion(proveedor: ConvenioProveedor): void {
    this.proveedorEditandoId.set(proveedor.id);
    this.borradorEdicion.set({ ...proveedor });
    this.confirmandoEliminacionId.set(null);
  }

  cancelarEdicion(): void {
    this.proveedorEditandoId.set(null);
    this.borradorEdicion.set({});
  }

  guardarEdicion(): void {
    const id = this.proveedorEditandoId();
    const borrador = this.borradorEdicion();
    if (id === null) return;
    this.proveedores = this.proveedores.map((p) =>
      p.id === id ? { ...p, ...borrador } as ConvenioProveedor : p
    );
    this.proveedorEditandoId.set(null);
    this.borradorEdicion.set({});
    this.mensajeSimulacion.set(`✏️ Convenio actualizado correctamente.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  pedirEliminacion(id: number): void {
    this.confirmandoEliminacionId.set(id);
    this.proveedorEditandoId.set(null);
  }

  cancelarEliminacion(): void {
    this.confirmandoEliminacionId.set(null);
  }

  confirmarEliminacion(id: number): void {
    const proveedor = this.proveedores.find((p) => p.id === id);
    this.proveedores = this.proveedores.filter((p) => p.id !== id);
    this.confirmandoEliminacionId.set(null);
    this.mensajeSimulacion.set(`🗑️ Proveedor "${proveedor?.nombre}" eliminado del directorio.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  claseBadgeEstado(estado: EstadoConvenio): string {
    const mapa: Record<EstadoConvenio, string> = {
      'Activo': 'bg-success-subtle text-success-emphasis',
      'Suspendido': 'bg-danger-subtle text-danger-emphasis',
      'En Renovación': 'bg-warning-subtle text-warning-emphasis'
    };
    return mapa[estado];
  }

  claseBadgeTipo(tipo: TipoProveedor): string {
    return tipo === 'Aerolínea'
      ? 'bg-info-subtle text-info-emphasis'
      : 'bg-secondary-subtle text-secondary-emphasis';
  }

  iconoTipo(tipo: TipoProveedor): string {
    return tipo === 'Aerolínea' ? '✈️' : '🚌';
  }

  get borradorEstadoActual(): EstadoConvenio {
    return (this.borradorEdicion() as ConvenioProveedor).estado ?? 'Activo';
  }

  set borradorEstadoActual(val: EstadoConvenio) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), estado: val });
  }

  get borradorTarifa(): number | null {
    return (this.borradorEdicion() as ConvenioProveedor).tarifaCorporativa ?? null;
  }

  set borradorTarifa(val: number | null) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), tarifaCorporativa: val ?? 0 });
  }

  get borradorFrecuencias(): string {
    return (this.borradorEdicion() as ConvenioProveedor).frecuencias ?? '';
  }

  set borradorFrecuencias(val: string) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), frecuencias: val });
  }

  private crearBorrador(): BorradorProveedor {
    return {
      nombre: '',
      tipo: 'Aerolínea',
      ciudad: 'Galápagos',
      tarifaCorporativa: null,
      unidadTarifa: 'por trayecto',
      frecuencias: '',
      estado: 'Activo'
    };
  }
}
