import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconoComponent } from '../compartido/icono/icono.component';
import { CatalogoEditDialogComponent } from './catalogo-edit-dialog/catalogo-edit-dialog.component';
import { ConfirmacionDialogoComponent } from '../compartido/confirmacion-dialogo/confirmacion-dialogo.component';

export type RegionEcuador = 'Costa' | 'Sierra' | 'Amazonía' | 'Insular';
export type EstadoCupos = 'Disponible' | 'Últimos cupos' | 'Agotado';
export type VistaCatalogo = 'lista' | 'formulario' | 'itinerario';

export interface DiaItinerario {
  titulo: string;
  actividades: string;
}

export interface PaqueteTuristico {
  id: number;
  nombre: string;
  destino: string;
  region: RegionEcuador;
  duracionDias: number;
  descripcion: string;
  itinerario: DiaItinerario[];
  servicios: string[];
  tarifaBaja: number;
  tarifaAlta: number;
  cuposTotales: number;
  cuposDisponibles: number;
}

@Component({
  selector: 'app-modulo-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, IconoComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class ModuloCatalogoComponent {
  private readonly dialog = inject(MatDialog);

  readonly regiones: RegionEcuador[] = ['Costa', 'Sierra', 'Amazonía', 'Insular'];

  paquetes: PaqueteTuristico[] = [
    {
      id: 1,
      nombre: 'Galápagos Imperial (5D/4N)',
      destino: 'Islas Galápagos',
      region: 'Insular',
      duracionDias: 5,
      descripcion: 'Recorrido por Santa Cruz, Isabela y San Cristóbal con fauna endémica y snorkel.',
      itinerario: [
        { titulo: 'Llegada a Santa Cruz', actividades: 'Traslado al hotel, visita a la Estación Charles Darwin y cena de bienvenida.' },
        { titulo: 'Bahía Tortuga y Las Grietas', actividades: 'Caminata a Tortuga Bay, snorkel en Las Grietas y tarde libre en Puerto Ayora.' },
        { titulo: 'Isla Isabela', actividades: 'Cruce en lancha, Los Túneles, tintoreras y observación de pingüinos.' },
        { titulo: 'Volcán Sierra Negra', actividades: 'Ascenso guiado al cráter, almuerzo campestre y regreso a Santa Cruz.' },
        { titulo: 'Retorno', actividades: 'Desayuno, compras de recuerdos y traslado al aeropuerto.' }
      ],
      servicios: ['Boleto aéreo Guayaquil–Galápagos', 'Hospedaje 4 noches', 'Desayunos y cenas', 'Guía naturalista bilingüe', 'Tasas de ingreso al parque'],
      tarifaBaja: 607,
      tarifaAlta: 809,
      cuposTotales: 20,
      cuposDisponibles: 12
    },
    {
      id: 2,
      nombre: 'Ruta de los Volcanes: Cotopaxi, Quilotoa y Baños (3D/2N)',
      destino: 'Cotopaxi, Quilotoa y Baños',
      region: 'Sierra',
      duracionDias: 3,
      descripcion: 'Circuito andino por volcanes, lagunas de cráter y aventura en la ruta de las cascadas.',
      itinerario: [
        { titulo: 'Parque Nacional Cotopaxi', actividades: 'Visita al refugio José Rivas, caminata a la laguna de Limpiopungo y hospedaje en hacienda.' },
        { titulo: 'Laguna del Quilotoa', actividades: 'Mirador del cráter, descenso a la laguna y traslado a Baños de Agua Santa.' },
        { titulo: 'Baños y Pailón del Diablo', actividades: 'Ruta de las cascadas, puentes colgantes, aguas termales y regreso a Quito.' }
      ],
      servicios: ['Transporte turístico', 'Hospedaje 2 noches', 'Desayunos incluidos', 'Guía local certificado', 'Entradas a atractivos'],
      tarifaBaja: 234,
      tarifaAlta: 312,
      cuposTotales: 25,
      cuposDisponibles: 18
    },
    {
      id: 3,
      nombre: 'Expedición Amazónica: Tena y Cuyabeno (4D/3N)',
      destino: 'Tena y Reserva Cuyabeno',
      region: 'Amazonía',
      duracionDias: 4,
      descripcion: 'Inmersión en la selva con comunidades kichwa, navegación en canoa y observación de vida silvestre.',
      itinerario: [
        { titulo: 'Llegada a Tena', actividades: 'Recepción, visita a un centro de rescate de fauna y cena típica.' },
        { titulo: 'Río Napo', actividades: 'Rafting suave, lavado de oro artesanal y convivencia con la comunidad kichwa.' },
        { titulo: 'Reserva Cuyabeno', actividades: 'Navegación en canoa, pesca de piraña y caminata nocturna con guía.' },
        { titulo: 'Amanecer en la laguna', actividades: 'Observación de aves al amanecer, desayuno y retorno.' }
      ],
      servicios: ['Transporte terrestre y fluvial', 'Hospedaje en ecolodge', 'Pensión completa', 'Guía nativo bilingüe', 'Botas de caucho'],
      tarifaBaja: 306,
      tarifaAlta: 408,
      cuposTotales: 14,
      cuposDisponibles: 4
    },
    {
      id: 4,
      nombre: 'Ruta del Spondylus: Montañita y Puerto López (3D/2N)',
      destino: 'Montañita y Puerto López',
      region: 'Costa',
      duracionDias: 3,
      descripcion: 'Playas del Pacífico ecuatoriano con surf, avistamiento de ballenas y Parque Machalilla.',
      itinerario: [
        { titulo: 'Montañita', actividades: 'Salida desde Guayaquil, tarde de playa, clase de surf y vida nocturna.' },
        { titulo: 'Puerto López e Isla de la Plata', actividades: 'Excursión en lancha, caminata por la isla y observación de ballenas jorobadas.' },
        { titulo: 'Los Frailes y retorno', actividades: 'Visita a la playa Los Frailes, almuerzo de mariscos y regreso.' }
      ],
      servicios: ['Transporte ida y vuelta', 'Hospedaje 2 noches', 'Desayunos incluidos', 'Tour a Isla de la Plata', 'Guía local'],
      tarifaBaja: 189,
      tarifaAlta: 252,
      cuposTotales: 20,
      cuposDisponibles: 0
    }
  ];

  vista: VistaCatalogo = 'lista';
  paqueteActivo: PaqueteTuristico | null = null;
  mensajeNotificacion: string = '';

  textoBusqueda: string = '';
  regionFiltro: RegionEcuador | 'Todas' = 'Todas';

  editando: boolean = false;
  borrador: PaqueteTuristico = this.crearBorrador();
  nuevoServicio: string = '';

  paquetesFiltrados(): PaqueteTuristico[] {
    const texto = this.textoBusqueda.trim().toLowerCase();
    return this.paquetes.filter((paquete) => {
      const coincideRegion = this.regionFiltro === 'Todas' || paquete.region === this.regionFiltro;
      const coincideTexto =
        texto === '' ||
        paquete.nombre.toLowerCase().includes(texto) ||
        paquete.destino.toLowerCase().includes(texto);
      return coincideRegion && coincideTexto;
    });
  }

  totalCuposDisponibles(): number {
    return this.paquetes.reduce((acum, item) => acum + item.cuposDisponibles, 0);
  }

  totalRegiones(): number {
    return new Set(this.paquetes.map((item) => item.region)).size;
  }

  paquetesAgotados(): number {
    return this.paquetes.filter((item) => item.cuposDisponibles <= 0).length;
  }

  estado(paquete: PaqueteTuristico): EstadoCupos {
    if (paquete.cuposDisponibles <= 0) {
      return 'Agotado';
    }
    return paquete.cuposDisponibles <= 5 ? 'Últimos cupos' : 'Disponible';
  }

  porcentajeOcupacion(paquete: PaqueteTuristico): number {
    if (paquete.cuposTotales <= 0) {
      return 0;
    }
    const ocupados = paquete.cuposTotales - paquete.cuposDisponibles;
    return Math.min(100, Math.max(0, Math.round((ocupados / paquete.cuposTotales) * 100)));
  }

  claseRegion(region: RegionEcuador): string {
    return region === 'Amazonía' ? 'region-amazonia' : `region-${region.toLowerCase()}`;
  }

  volverALista(): void {
    this.vista = 'lista';
    this.paqueteActivo = null;
  }

  verItinerario(paquete: PaqueteTuristico): void {
    this.paqueteActivo = paquete;
    this.vista = 'itinerario';
  }

  abrirNuevo(): void {
    this.borrador = this.crearBorrador();
    this.editando = false;
    this.nuevoServicio = '';
    this.vista = 'formulario';
  }

  // Abre la ventanita modal sobrepuesta para editar (MatDialog con panelClass 'dialogo-vidrio')
  abrirEdicion(paquete: PaqueteTuristico): void {
    const ref = this.dialog.open(CatalogoEditDialogComponent, {
      data: { paquete },
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    ref.afterClosed().subscribe((resultado: PaqueteTuristico | null) => {
      if (resultado) {
        this.paquetes = this.paquetes.map((item) => (item.id === resultado.id ? resultado : item));
        this.mostrarNotificacion(`Paquete "${resultado.nombre}" actualizado correctamente.`);
      }
    });
  }

  // Abre la ventanita modal sobrepuesta para confirmar eliminación
  solicitarEliminar(paquete: PaqueteTuristico): void {
    this.dialog
      .open(ConfirmacionDialogoComponent, {
        data: {
          titulo: 'Eliminar paquete turístico',
          mensaje: `Se eliminará el paquete "${paquete.nombre}" (${paquete.destino}) del catálogo. Esta acción no se puede deshacer. ¿Deseas continuar?`,
          tipo: 'peligro',
          textoConfirmar: 'Sí, eliminar paquete'
        },
        panelClass: 'dialogo-vidrio'
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          const nombre = paquete.nombre;
          this.paquetes = this.paquetes.filter((item) => item.id !== paquete.id);
          this.mostrarNotificacion(`Paquete "${nombre}" eliminado correctamente.`);
        }
      });
  }

  cambiarDuracion(dias: number): void {
    const cantidad = Math.min(15, Math.max(1, Math.floor(Number(dias) || 1)));
    this.borrador.duracionDias = cantidad;
    while (this.borrador.itinerario.length < cantidad) {
      this.borrador.itinerario.push({
        titulo: `Día ${this.borrador.itinerario.length + 1}`,
        actividades: ''
      });
    }
    this.borrador.itinerario.length = cantidad;
  }

  agregarServicio(): void {
    const servicio = this.nuevoServicio.trim();
    if (servicio === '' || this.borrador.servicios.includes(servicio)) {
      return;
    }
    this.borrador.servicios.push(servicio);
    this.nuevoServicio = '';
  }

  quitarServicio(indice: number): void {
    this.borrador.servicios.splice(indice, 1);
  }

  formularioValido(): boolean {
    const p = this.borrador;
    return (
      (p.nombre?.trim().length ?? 0) >= 3 &&
      (p.destino?.trim().length ?? 0) >= 2 &&
      Number(p.tarifaBaja) > 0 &&
      Number(p.tarifaAlta) >= Number(p.tarifaBaja) &&
      Number(p.cuposTotales) >= 1 &&
      Number(p.cuposDisponibles) >= 0 &&
      Number(p.cuposDisponibles) <= Number(p.cuposTotales)
    );
  }

  guardar(): void {
    if (!this.formularioValido()) {
      return;
    }
    // Asegurar itinerario con títulos por defecto si están vacíos
    this.borrador.itinerario.forEach((dia, idx) => {
      if (!dia.titulo.trim()) {
        dia.titulo = `Día ${idx + 1}`;
      }
    });

    const siguiente = Math.max(0, ...this.paquetes.map((item) => item.id)) + 1;
    this.paquetes = [...this.paquetes, { ...this.borrador, id: siguiente }];
    this.mostrarNotificacion(`Paquete "${this.borrador.nombre}" registrado correctamente.`);
    this.volverALista();
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.regionFiltro = 'Todas';
  }

  private mostrarNotificacion(mensaje: string): void {
    this.mensajeNotificacion = mensaje;
    setTimeout(() => (this.mensajeNotificacion = ''), 4000);
  }

  private crearBorrador(): PaqueteTuristico {
    return {
      id: 0,
      nombre: '',
      destino: '',
      region: 'Costa',
      duracionDias: 3,
      descripcion: '',
      itinerario: [
        { titulo: 'Día 1: Bienvenida y llegada', actividades: 'Llegada al destino y check-in en el hotel.' },
        { titulo: 'Día 2: Recorrido y excursión', actividades: 'Actividades turísticas guiadas.' },
        { titulo: 'Día 3: Mañana libre y retorno', actividades: 'Tiempo libre para compras y regreso.' }
      ],
      servicios: ['Hospedaje', 'Guía turístico'],
      tarifaBaja: 150,
      tarifaAlta: 200,
      cuposTotales: 15,
      cuposDisponibles: 15
    };
  }
}
