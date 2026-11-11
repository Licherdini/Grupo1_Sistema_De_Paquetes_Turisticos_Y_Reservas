/* ==========================================================================
   ARCHIVO: src/app/components/principal/principal.component.ts
   FUNCIÓN: Página principal de AndesTravel UG tras iniciar sesión.
            Contiene el bosquejo general funcional de los 5 módulos del grupo.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface PaqueteTuristico {
  codigo: string;
  destino: string;
  region: string;
  cupos: number;
  precio: number;
  estado: 'Disponible' | 'Últimos cupos' | 'Agotado';
}

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  // Controla qué pestaña/módulo de los 5 integrantes se visualiza en el bosquejo
  moduloActivo: number = 1;

  // Two-way binding para el buscador de paquetes y el simulador de cotización
  filtroDestino: string = '';
  pasajerosCotizar: number = 2;
  precioBasePaquete: number = 450;
  // Código de la pre-reserva 
  codigoPreReserva: string = '';

  // Listado de los 5 módulos de la Propuesta 2A (AndesTravel UG)
  modulosGrupo = [
    {
      id: 1,
      titulo: 'Módulo 1: Seguridad y Perfiles',
      responsable: 'Jhon Herrera',
      icono: '🔐',
      descripcion: 'Control de acceso, gestión de sesiones activas, roles de agentes de viaje y auditoría de usuarios.'
    },
    {
      id: 2,
      titulo: 'Módulo 2: Catálogo de Paquetes',
      responsable: 'Anji López',
      icono: '🏝️',
      descripcion: 'Administración de destinos nacionales e internacionales, itinerarios por día, cupos y temporadas.'
    },
    {
      id: 3,
      titulo: 'Módulo 3: Proveedores, Hoteles y Transporte',
      responsable: 'Ñokostrian Acosta',
      icono: '🏨',
      descripcion: 'Convenios con aerolíneas, buses turísticos, cadenas hoteleras y asignación de guías certificados.'
    },
    {
      id: 4,
      titulo: 'Módulo 4: Cotizaciones y Reservas',
      responsable: 'Kenny Ñokormaza',
      icono: '📅',
      descripcion: 'Motor de cálculo de tarifas por número de pasajeros, fechas de salida y bloqueo de cupos.'
    },
    {
      id: 5,
      titulo: 'Módulo 5: Facturación, Pagos y Reseñas',
      responsable: 'Danny Ñokoval',
      icono: '💳',
      descripcion: 'Emisión de comprobantes electrónicos, registro de abonos/pagos y calificación post-viaje.'
    }
  ];

  // Datos de ejemplo para el bosquejo de paquetes turísticos
  paquetesDestacados: PaqueteTuristico[] = [
    { codigo: 'AND-01', destino: 'Galápagos Imperial (5D/4N)', region: 'Insular', cupos: 12, precio: 890, estado: 'Disponible' },
    { codigo: 'AND-02', destino: 'Ruta de los Volcanes - Baños y Quilotoa', region: 'Sierra', cupos: 20, precio: 240, estado: 'Disponible' },
    { codigo: 'AND-03', destino: 'Aventura Amazónica - Cuyabeno Lodge', region: 'Amazonía', cupos: 8, precio: 380, estado: 'Últimos cupos' },
    { codigo: 'AND-04', destino: 'Sol y Playa - Salinas y Ayangue', region: 'Costa', cupos: 25, precio: 185, estado: 'Disponible' },
    { codigo: 'AND-05', destino: 'Cuenca Colonial y Parque Cajas (3D/2N)', region: 'Sierra', cupos: 0, precio: 150, estado: 'Agotado' }
  ];

  constructor(public authService: AuthService) {}

  // Event binding para cambiar entre los 5 módulos del grupo
  seleccionarModulo(id: number): void {
    this.moduloActivo = id;
  }

  // Método tipado al estilo de la Clase 4 del profesor para calcular cotización
  calcularTotalCotizacion(pasajeros: number, precioUnitario: number): number {
    return pasajeros * precioUnitario;
  }

    // Filtro en tiempo real del catálogo (Módulo 2): destino, región o código
  paquetesFiltrados(): PaqueteTuristico[] {
    const texto = this.filtroDestino.trim().toLowerCase();
    if (texto === '') {
      return this.paquetesDestacados;
    }
    return this.paquetesDestacados.filter(
      (p) =>
        p.destino.toLowerCase().includes(texto) ||
        p.region.toLowerCase().includes(texto) ||
        p.codigo.toLowerCase().includes(texto)
    );
  }

  // Genera un código identificador de pre-reserva (Módulo 4)
  generarPreReserva(): void {
    const sufijo: string = Date.now().toString().slice(-6);
    this.codigoPreReserva = `AND-RES-${sufijo}`;
  }
}