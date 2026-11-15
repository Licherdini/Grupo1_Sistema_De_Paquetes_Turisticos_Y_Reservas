/* ==========================================================================
   ARCHIVO: proveedores-hoteles.component.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Sección "Cadenas Hoteleras" (/proveedores/hoteles). CRUD en
            memoria de convenios con cadenas hoteleras aliadas, filtrables
            por ciudad, categoría y régimen de alimentación.
   ========================================================================== */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CategoriaHotel = '⭐⭐' | '⭐⭐⭐' | '⭐⭐⭐⭐' | '⭐⭐⭐⭐⭐';
export type RegimenAlimentacion = 'Solo alojamiento' | 'Desayuno incluido' | 'Todo incluido';
export type EstadoConvenioHotel = 'Activo' | 'Suspendido' | 'En Renovación';

export interface ConvenioHotel {
  id: number;
  cadena: string;
  nombreHotel: string;
  ciudad: string;
  categoria: CategoriaHotel;
  tarifaNoche: number;
  regimen: RegimenAlimentacion;
  habitaciones: string;
  estado: EstadoConvenioHotel;
}

export interface BorradorHotel {
  cadena: string;
  nombreHotel: string;
  ciudad: string;
  categoria: CategoriaHotel;
  tarifaNoche: number | null;
  regimen: RegimenAlimentacion;
  habitaciones: string;
  estado: EstadoConvenioHotel;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-proveedores-hoteles',
  styleUrl: './proveedores-hoteles.component.css',
  templateUrl: './proveedores-hoteles.component.html',
})
export class ProveedoresHotelesComponent {
  readonly categorias: CategoriaHotel[] = ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
  readonly regimenes: RegimenAlimentacion[] = [
    'Solo alojamiento',
    'Desayuno incluido',
    'Todo incluido'
  ];
  readonly estadosConvenio: EstadoConvenioHotel[] = ['Activo', 'Suspendido', 'En Renovación'];
  readonly ciudadesDestino: string[] = [
    'Galápagos', 'Cuenca', 'Baños', 'Manta', 'Loja',
    'Esmeraldas', 'Ambato', 'Quito', 'Guayaquil', 'Montañita'
  ];

  // Filtros
  filtroCiudad: string = 'Todas';
  filtroCategoria: string = 'Todas';
  filtroRegimen: string = 'Todos';
  filtroEstado: string = 'Todos';

  // Control de edición y eliminación
  hotelEditandoId = signal<number | null>(null);
  borradorEdicion = signal<Partial<ConvenioHotel>>({});
  mensajeSimulacion = signal<string>('');
  confirmandoEliminacionId = signal<number | null>(null);

  // Formulario de creación
  mostrarFormulario: boolean = false;
  nuevoHotel: BorradorHotel = this.crearBorrador();

  hoteles: ConvenioHotel[] = [
    {
      id: 1,
      cadena: 'Decameron',
      nombreHotel: 'Decameron Punta Blanca',
      ciudad: 'Manta',
      categoria: '⭐⭐⭐⭐',
      tarifaNoche: 95,
      regimen: 'Todo incluido',
      habitaciones: 'Doble, Suite vista al mar',
      estado: 'Activo'
    },
    {
      id: 2,
      cadena: 'Marriott',
      nombreHotel: 'Marriott Quito',
      ciudad: 'Quito',
      categoria: '⭐⭐⭐⭐⭐',
      tarifaNoche: 185,
      regimen: 'Desayuno incluido',
      habitaciones: 'Estándar, Deluxe, Suite Ejecutiva',
      estado: 'Activo'
    },
    {
      id: 3,
      cadena: 'Hilton',
      nombreHotel: 'Hilton Colón Guayaquil',
      ciudad: 'Guayaquil',
      categoria: '⭐⭐⭐⭐⭐',
      tarifaNoche: 170,
      regimen: 'Solo alojamiento',
      habitaciones: 'Estándar, Deluxe, Suite',
      estado: 'En Renovación'
    },
    {
      id: 4,
      cadena: 'Rincon del Viajero',
      nombreHotel: 'Hostal Rincón del Viajero',
      ciudad: 'Baños',
      categoria: '⭐⭐⭐',
      tarifaNoche: 45,
      regimen: 'Desayuno incluido',
      habitaciones: 'Simple, Doble, Familiar',
      estado: 'Activo'
    },
    {
      id: 5,
      cadena: 'Finch Bay',
      nombreHotel: 'Finch Bay Eco Hotel',
      ciudad: 'Galápagos',
      categoria: '⭐⭐⭐⭐⭐',
      tarifaNoche: 320,
      regimen: 'Todo incluido',
      habitaciones: 'Cabaña ecológica, Suite jardín',
      estado: 'Activo'
    },
    {
      id: 6,
      cadena: 'Casa Loja',
      nombreHotel: 'Casa Loja Boutique',
      ciudad: 'Loja',
      categoria: '⭐⭐⭐⭐',
      tarifaNoche: 75,
      regimen: 'Desayuno incluido',
      habitaciones: 'Doble estándar, Suite colonial',
      estado: 'Suspendido'
    }
  ];

  // ── READ: filtrado combinado ──────────────────────────────────────────────
  hotelesFiltrados(): ConvenioHotel[] {
    return this.hoteles.filter((h) => {
      const coincideCiudad = this.filtroCiudad === 'Todas' || h.ciudad === this.filtroCiudad;
      const coincideCategoria = this.filtroCategoria === 'Todas' || h.categoria === this.filtroCategoria;
      const coincideRegimen = this.filtroRegimen === 'Todos' || h.regimen === this.filtroRegimen;
      const coincideEstado = this.filtroEstado === 'Todos' || h.estado === this.filtroEstado;
      return coincideCiudad && coincideCategoria && coincideRegimen && coincideEstado;
    });
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  formularioValido(): boolean {
    const h = this.nuevoHotel;
    return (
      h.nombreHotel.trim().length >= 4 &&
      h.cadena.trim().length >= 2 &&
      this.ciudadesDestino.includes(h.ciudad) &&
      (h.tarifaNoche ?? 0) > 0
    );
  }

  registrarHotel(): void {
    if (!this.formularioValido()) return;
    const siguiente = Math.max(0, ...this.hoteles.map((h) => h.id)) + 1;
    const nuevo: ConvenioHotel = {
      id: siguiente,
      cadena: this.nuevoHotel.cadena.trim(),
      nombreHotel: this.nuevoHotel.nombreHotel.trim(),
      ciudad: this.nuevoHotel.ciudad,
      categoria: this.nuevoHotel.categoria,
      tarifaNoche: Number(this.nuevoHotel.tarifaNoche),
      regimen: this.nuevoHotel.regimen,
      habitaciones: this.nuevoHotel.habitaciones.trim() || 'Sin especificar',
      estado: this.nuevoHotel.estado
    };
    this.hoteles = [nuevo, ...this.hoteles];
    this.nuevoHotel = this.crearBorrador();
    this.mostrarFormulario = false;
    this.mensajeSimulacion.set(`✅ Hotel "${nuevo.nombreHotel}" registrado correctamente.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  iniciarEdicion(hotel: ConvenioHotel): void {
    this.hotelEditandoId.set(hotel.id);
    this.borradorEdicion.set({ ...hotel });
    this.confirmandoEliminacionId.set(null);
  }

  cancelarEdicion(): void {
    this.hotelEditandoId.set(null);
    this.borradorEdicion.set({});
  }

  guardarEdicion(): void {
    const id = this.hotelEditandoId();
    const borrador = this.borradorEdicion();
    if (id === null) return;
    this.hoteles = this.hoteles.map((h) =>
      h.id === id ? { ...h, ...borrador } as ConvenioHotel : h
    );
    this.hotelEditandoId.set(null);
    this.borradorEdicion.set({});
    this.mensajeSimulacion.set(`✏️ Convenio hotelero actualizado correctamente.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  pedirEliminacion(id: number): void {
    this.confirmandoEliminacionId.set(id);
    this.hotelEditandoId.set(null);
  }

  cancelarEliminacion(): void {
    this.confirmandoEliminacionId.set(null);
  }

  confirmarEliminacion(id: number): void {
    const hotel = this.hoteles.find((h) => h.id === id);
    this.hoteles = this.hoteles.filter((h) => h.id !== id);
    this.confirmandoEliminacionId.set(null);
    this.mensajeSimulacion.set(`🗑️ Hotel "${hotel?.nombreHotel}" dado de baja del directorio.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  claseBadgeEstado(estado: EstadoConvenioHotel): string {
    const mapa: Record<EstadoConvenioHotel, string> = {
      'Activo': 'bg-success-subtle text-success-emphasis',
      'Suspendido': 'bg-danger-subtle text-danger-emphasis',
      'En Renovación': 'bg-warning-subtle text-warning-emphasis'
    };
    return mapa[estado];
  }

  claseColorRegimen(regimen: RegimenAlimentacion): string {
    const mapa: Record<RegimenAlimentacion, string> = {
      'Solo alojamiento': 'bg-secondary-subtle text-secondary-emphasis',
      'Desayuno incluido': 'bg-info-subtle text-info-emphasis',
      'Todo incluido': 'bg-success-subtle text-success-emphasis'
    };
    return mapa[regimen];
  }

  get borradorTarifa(): number | null {
    return (this.borradorEdicion() as ConvenioHotel).tarifaNoche ?? null;
  }

  set borradorTarifa(val: number | null) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), tarifaNoche: val ?? 0 });
  }

  get borradorRegimenActual(): RegimenAlimentacion {
    return (this.borradorEdicion() as ConvenioHotel).regimen ?? 'Solo alojamiento';
  }

  set borradorRegimenActual(val: RegimenAlimentacion) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), regimen: val });
  }

  get borradorEstadoActual(): EstadoConvenioHotel {
    return (this.borradorEdicion() as ConvenioHotel).estado ?? 'Activo';
  }

  set borradorEstadoActual(val: EstadoConvenioHotel) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), estado: val });
  }

  get borradorHabitaciones(): string {
    return (this.borradorEdicion() as ConvenioHotel).habitaciones ?? '';
  }

  set borradorHabitaciones(val: string) {
    this.borradorEdicion.set({ ...this.borradorEdicion(), habitaciones: val });
  }

  private crearBorrador(): BorradorHotel {
    return {
      cadena: '',
      nombreHotel: '',
      ciudad: 'Galápagos',
      categoria: '⭐⭐⭐',
      tarifaNoche: null,
      regimen: 'Desayuno incluido',
      habitaciones: '',
      estado: 'Activo'
    };
  }
}
