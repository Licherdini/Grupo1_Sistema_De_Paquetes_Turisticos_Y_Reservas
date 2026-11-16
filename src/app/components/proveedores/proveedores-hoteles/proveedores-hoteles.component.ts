/* ==========================================================================
   ARCHIVO: proveedores-hoteles.component.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Sección "Cadenas Hoteleras" (/proveedores/hoteles).
            Convenios con cadenas hoteleras aliadas. La edición y eliminación
            se realizan mediante ventanas modales sobrepuestas (MatDialog con
            panelClass 'dialogo-vidrio'), homogéneas con el Módulo 1.
   ========================================================================== */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconoComponent } from '../../compartido/icono/icono.component';

import { HotelesEditDialogComponent } from '../hoteles-edit-dialog/hoteles-edit-dialog.component';
import { ConfirmacionDialogoComponent } from '../../compartido/confirmacion-dialogo/confirmacion-dialogo.component';

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
  imports: [CommonModule, FormsModule, IconoComponent],
  selector: 'app-proveedores-hoteles',
  styleUrl: './proveedores-hoteles.component.css',
  templateUrl: './proveedores-hoteles.component.html',
})
export class ProveedoresHotelesComponent {
  private readonly dialog = inject(MatDialog);

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

  // Mensaje de feedback
  mensajeSimulacion = signal<string>('');

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
    this.mensajeSimulacion.set(`Hotel "${nuevo.nombreHotel}" registrado correctamente.`);
    setTimeout(() => this.mensajeSimulacion.set(''), 4000);
  }

  // ── UPDATE: ventana modal sobrepuesta (MatDialog) ─────────────────────────
  abrirDialogEdicion(hotel: ConvenioHotel): void {
    const ref = this.dialog.open(HotelesEditDialogComponent, {
      data: { hotel },
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    ref.afterClosed().subscribe((resultado: ConvenioHotel | null) => {
      if (resultado) {
        this.hoteles = this.hoteles.map((h) => (h.id === hotel.id ? resultado : h));
        this.mensajeSimulacion.set(`Convenio con "${resultado.nombreHotel}" actualizado correctamente.`);
        setTimeout(() => this.mensajeSimulacion.set(''), 4000);
      }
    });
  }

  // ── DELETE: ventana modal de confirmación sobrepuesta ─────────────────────
  eliminar(hotel: ConvenioHotel): void {
    this.dialog
      .open(ConfirmacionDialogoComponent, {
        data: {
          titulo: 'Eliminar hotel aliado',
          mensaje: `Se eliminará el convenio con el hotel "${hotel.nombreHotel}" (${hotel.ciudad}). ¿Deseas continuar?`,
          tipo: 'peligro',
          textoConfirmar: 'Sí, eliminar'
        },
        panelClass: 'dialogo-vidrio'
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.hoteles = this.hoteles.filter((h) => h.id !== hotel.id);
          this.mensajeSimulacion.set(`Hotel "${hotel.nombreHotel}" dado de baja del directorio.`);
          setTimeout(() => this.mensajeSimulacion.set(''), 4000);
        }
      });
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
