/* ==========================================================================
   ARCHIVO: src/app/services/modulos.service.ts
   TEORÍA DEL CURSO: Servicio para compartir datos entre los componentes
   FUNCIÓN: Fuente única de los 5 módulos (título, responsable, estado, URL y
            secciones del submenú). La usan la Página Principal (tarjetas)
            Cuando terminen su módulo, cambia SOLO su línea.
   ========================================================================== */

import { Injectable } from '@angular/core';

export interface SeccionModulo {
  ruta: string;      // URL de la sección
  etiqueta: string;  
}

export interface ModuloGrupo {
  id: number;
  ruta: string;      // del módulo
  titulo: string;
  responsable: string;
  icono: string;
  descripcion: string;
  estado: 'Funcional' | 'En bosquejo';
  secciones: SeccionModulo[];   // vacío = módulo de una sola página (sin submenú)
}

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  public modulosGrupo: ModuloGrupo[] = [
    {
      id: 1,
      ruta: 'seguridad',
      titulo: 'Módulo 1: Seguridad y Perfiles',
      responsable: 'Jhon Herrera Merchán',
      icono: '🔐',
      descripcion: 'Control de acceso, sesión activa, perfiles con roles y registro de accesos.',
      estado: 'Funcional',
      secciones: [
        { ruta: 'sesion', etiqueta: 'Mi sesión' },
        { ruta: 'perfiles', etiqueta: 'Perfiles' },
        { ruta: 'accesos', etiqueta: 'Registro de accesos' }
      ]
    },
    {
      id: 2,
      ruta: 'catalogo',
      titulo: 'Módulo 2: Catálogo de Paquetes',
      responsable: 'Angie Lopez Mena',
      icono: '🏝️',
      descripcion: 'Destinos por regiones del Ecuador, itinerarios, cupos y tarifas base.',
      estado: 'En bosquejo',
      secciones: []
    },
    {
      id: 3,
      ruta: 'proveedores',
      titulo: 'Módulo 3: Proveedores, Hoteles y Transporte',
      responsable: 'Sebastián Acosta Andrade',
      icono: '🏨',
      descripcion: 'Convenios con aerolíneas, transporte, cadenas hoteleras y guías certificados.',
      estado: 'En bosquejo',
      secciones: []
    },
    {
      id: 4,
      ruta: 'cotizaciones',
      titulo: 'Módulo 4: Cotizaciones y Reservas',
      responsable: 'Kenny Ormaza Padilla',
      icono: '📅',
      descripcion: 'Motor de cálculo de tarifas por pasajeros, fechas de salida y bloqueo de cupos.',
      estado: 'En bosquejo',
      secciones: [
        { ruta: 'cotizador', etiqueta: 'Cotizador' },
        { ruta: 'reservas', etiqueta: 'Reservas' }
      ]
    },
    {
      id: 5,
      ruta: 'facturacion',
      titulo: 'Módulo 5: Facturación, Pagos y Reseñas',
      responsable: 'Danny Guaman Yucailla',
      icono: '💳',
      descripcion: 'Comprobantes electrónicos, registro de abonos y calificación post-viaje.',
      estado: 'En bosquejo',
      secciones: []
    }
  ];

  obtenerModulo(id: number): ModuloGrupo | undefined {
    return this.modulosGrupo.find((modulo) => modulo.id === id);
  }
}