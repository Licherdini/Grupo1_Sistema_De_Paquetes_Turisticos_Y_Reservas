/* ==========================================================================
   ARCHIVO: src/app/components/principal/principal.component.ts
   FUNCIÓN: Página principal de AndesTravel UG tras iniciar sesión. Muestra el
            banner, el selector de los 5 módulos y el componente del módulo
            elegido. Cada módulo es un componente independiente.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ModuloSeguridadComponent } from '../seguridad/seguridad.component';
import { ModuloCatalogoComponent } from '../catalogo/catalogo.component';
import { ModuloProveedoresComponent } from '../proveedores/proveedores.component';
import { ModuloCotizacionesComponent } from '../cotizaciones/cotizaciones.component';
import { ModuloFacturacionComponent } from '../facturacion/facturacion.component';

interface ModuloGrupo {
  id: number;
  titulo: string;
  responsable: string;
  icono: string;
  descripcion: string;
  estado: 'Funcional' | 'En bosquejo';
}

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    ModuloSeguridadComponent,
    ModuloCatalogoComponent,
    ModuloProveedoresComponent,
    ModuloCotizacionesComponent,
    ModuloFacturacionComponent
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  // Controla qué módulo de los 5 integrantes se visualiza
  moduloActivo: number = 1;

  // Fuente única de títulos, responsables y estado de los 5 módulos.
  // Cuando un integrante termine su módulo, cambia SOLO el estado de su línea.
  modulosGrupo: ModuloGrupo[] = [
    {
      id: 1,
      titulo: 'Módulo 1: Seguridad y Perfiles',
      responsable: 'Jhon Herrera Merchán',
      icono: '🔐',
      descripcion: 'Control de acceso, sesión activa, perfiles con roles y registro de accesos.',
      estado: 'Funcional'
    },
    {
      id: 2,
      titulo: 'Módulo 2: Catálogo de Paquetes',
      responsable: 'Angie Lopez Mena',
      icono: '🏝️',
      descripcion: 'Destinos por regiones del Ecuador, itinerarios, cupos y tarifas base.',
      estado: 'En bosquejo'
    },
    {
      id: 3,
      titulo: 'Módulo 3: Proveedores, Hoteles y Transporte',
      responsable: 'Sebastián Acosta Andrade',
      icono: '🏨',
      descripcion: 'Convenios con aerolíneas, transporte, cadenas hoteleras y guías certificados.',
      estado: 'En bosquejo'
    },
    {
      id: 4,
      titulo: 'Módulo 4: Cotizaciones y Reservas',
      responsable: 'Kenny Ormaza Padilla',
      icono: '📅',
      descripcion: 'Motor de cálculo de tarifas por pasajeros, fechas de salida y bloqueo de cupos.',
      estado: 'En bosquejo'
    },
    {
      id: 5,
      titulo: 'Módulo 5: Facturación, Pagos y Reseñas',
      responsable: 'Danny Guaman Yucailla',
      icono: '💳',
      descripcion: 'Comprobantes electrónicos, registro de abonos y calificación post-viaje.',
      estado: 'En bosquejo'
    }
  ];

  constructor(public authService: AuthService) {}

  // Event binding: cambia entre los 5 módulos del grupo
  seleccionarModulo(id: number): void {
    this.moduloActivo = id;
  }

  moduloSeleccionado(): ModuloGrupo | undefined {
    return this.modulosGrupo.find((modulo) => modulo.id === this.moduloActivo);
  }

  modulosFuncionales(): number {
    return this.modulosGrupo.filter((modulo) => modulo.estado === 'Funcional').length;
  }
}