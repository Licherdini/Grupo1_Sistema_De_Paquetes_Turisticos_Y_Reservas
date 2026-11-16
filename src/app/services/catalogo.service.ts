import { Injectable, signal } from '@angular/core';

export type RegionEcuador = 'Costa' | 'Sierra' | 'Amazonía' | 'Insular';
export type EstadoCupos = 'Disponible' | 'Últimos cupos' | 'Agotado';

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

export const REGIONES: RegionEcuador[] = ['Costa', 'Sierra', 'Amazonía', 'Insular'];

export function crearPaqueteVacio(): PaqueteTuristico {
  return {
    id: 0,
    nombre: '',
    destino: '',
    region: 'Costa',
    duracionDias: 3,
    descripcion: '',
    itinerario: [
      { titulo: 'Día 1', actividades: '' },
      { titulo: 'Día 2', actividades: '' },
      { titulo: 'Día 3', actividades: '' }
    ],
    servicios: [],
    tarifaBaja: 0,
    tarifaAlta: 0,
    cuposTotales: 1,
    cuposDisponibles: 1
  };
}

const CLAVE_ALMACEN = 'andestravel.catalogo.paquetes';

const PAQUETES_INICIALES: PaqueteTuristico[] = [
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

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  public paquetes = signal<PaqueteTuristico[]>(this.leer());

  crear(datos: PaqueteTuristico): PaqueteTuristico {
    const siguiente = Math.max(0, ...this.paquetes().map((p) => p.id)) + 1;
    const nuevo: PaqueteTuristico = { ...datos, id: siguiente };
    this.paquetes.update((lista) => [...lista, nuevo]);
    this.guardar();
    return nuevo;
  }

  actualizar(paquete: PaqueteTuristico): void {
    this.paquetes.update((lista) => lista.map((p) => (p.id === paquete.id ? paquete : p)));
    this.guardar();
  }

  eliminar(id: number): void {
    this.paquetes.update((lista) => lista.filter((p) => p.id !== id));
    this.guardar();
  }

  private guardar(): void {
    try {
      localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(this.paquetes()));
    } catch {
      return;
    }
  }

  private leer(): PaqueteTuristico[] {
    try {
      const crudo = localStorage.getItem(CLAVE_ALMACEN);
      if (crudo) {
        const lista = JSON.parse(crudo) as PaqueteTuristico[];
        if (Array.isArray(lista)) {
          return lista;
        }
      }
    } catch {
      return structuredClone(PAQUETES_INICIALES);
    }
    return structuredClone(PAQUETES_INICIALES);
  }
}