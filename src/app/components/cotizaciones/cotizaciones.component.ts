import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface PaqueteCotizable {
  id: string;
  nombre: string;
  region: string;
  duracion: string;
  precioBase: number;
  cuposDisponibles: number;
}

export interface ServicioAdicional {
  id: string;
  nombre: string;
  descripcion: string;
  costoPorPersona: number;
  seleccionado: boolean;
}

@Component({
  selector: 'app-modulo-cotizaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cotizaciones.component.html',
  styleUrl: './cotizaciones.component.css'
})
export class ModuloCotizacionesComponent {
  objetivo: string =
    'Proporcionar un calculador de tarifas en tiempo real y coordinar el bloqueo temporal de cupos para los usuarios.';

  paquetes: PaqueteCotizable[] = [
    {
      id: 'PKG-GAL-01',
      nombre: 'Galápagos Imperial (5D/4N)',
      region: 'Insular',
      duracion: '5 días / 4 noches',
      precioBase: 674,
      cuposDisponibles: 12
    },
    {
      id: 'PKG-SIE-02',
      nombre: 'Ruta de los Volcanes: Cotopaxi, Quilotoa y Baños (3D/2N)',
      region: 'Sierra',
      duracion: '3 días / 2 noches',
      precioBase: 260,
      cuposDisponibles: 18
    },
    {
      id: 'PKG-AMA-03',
      nombre: 'Expedición Amazónica: Tena y Cuyabeno (4D/3N)',
      region: 'Amazonía',
      duracion: '4 días / 3 noches',
      precioBase: 340,
      cuposDisponibles: 10
    },
    {
      id: 'PKG-COS-04',
      nombre: 'Ruta del Spondylus: Montañita y Puerto López (3D/2N)',
      region: 'Costa',
      duracion: '3 días / 2 noches',
      precioBase: 210,
      cuposDisponibles: 15
    }
  ];

  serviciosAdicionales: ServicioAdicional[] = [
    {
      id: 'ADD-SEG',
      nombre: 'Seguro de viaje integral',
      descripcion: 'Cobertura médica y asistencia en ruta',
      costoPorPersona: 25,
      seleccionado: true
    },
    {
      id: 'ADD-EXC',
      nombre: 'Excursiones nocturnas guiadas',
      descripcion: 'Recorridos culturales y miradores nocturnos',
      costoPorPersona: 40,
      seleccionado: false
    },
    {
      id: 'ADD-UPG',
      nombre: 'Upgrade de habitación superior',
      descripcion: 'Suite panorámica con desayuno buffet',
      costoPorPersona: 65,
      seleccionado: false
    }
  ];

  nombreCliente: string = 'Cliente Corporativo UG';
  paqueteIdSeleccionado: string = 'PKG-GAL-01';
  fechaSalida: string = '2026-12-15';
  temporadaSeleccionada: 'Baja' | 'Media' | 'Alta' = 'Media';
  pasajeros: number = 2;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  get paquetesDisponibles(): PaqueteCotizable[] {
    return this.paquetes;
  }

  get paqueteSeleccionado(): PaqueteCotizable {
    return (
      this.paquetes.find((p) => p.id === this.paqueteIdSeleccionado) ?? this.paquetes[0]
    );
  }

  cambiarPasajeros(delta: number): void {
    const nuevoValor = (Number(this.pasajeros) || 1) + delta;
    if (nuevoValor >= 1 && nuevoValor <= 20) {
      this.pasajeros = nuevoValor;
    }
  }

  obtenerFactorTemporada(): number {
    if (this.temporadaSeleccionada === 'Baja') {
      return 0.9;
    }
    if (this.temporadaSeleccionada === 'Alta') {
      return 1.2;
    }
    return 1.0;
  }

  calcularSubtotalPaquete(): number {
    const cantidad = Math.max(1, Number(this.pasajeros) || 0);
    return this.paqueteSeleccionado.precioBase * cantidad * this.obtenerFactorTemporada();
  }

  calcularSubtotalAdicionales(): number {
    const cantidad = Math.max(1, Number(this.pasajeros) || 0);
    const costoAdicionalPersona = this.serviciosAdicionales
      .filter((item) => item.seleccionado)
      .reduce((acum, item) => acum + item.costoPorPersona, 0);

    return costoAdicionalPersona * cantidad;
  }

  calcularTotal(): number {
    return this.calcularSubtotalPaquete() + this.calcularSubtotalAdicionales();
  }

  formularioValido(): boolean {
    const cantidad = Number(this.pasajeros) || 0;
    return (
      this.nombreCliente.trim().length >= 3 &&
      this.fechaSalida.trim().length > 0 &&
      cantidad >= 1 &&
      cantidad <= this.paqueteSeleccionado.cuposDisponibles
    );
  }

  generarPreReserva(): void {
    if (!this.formularioValido()) {
      return;
    }

    const paquete = this.paqueteSeleccionado;
    const cantidad = Number(this.pasajeros);
    paquete.cuposDisponibles -= cantidad;

    const titularActivo = (
      this.authService.usuarioActual() ||
      this.nombreCliente.trim() ||
      'ADMIN'
    ).toUpperCase();

    this.router.navigate(['/reservas'], {
      state: {
        nuevaReserva: {
          titular: titularActivo,
          destino: paquete.nombre,
          pasajeros: cantidad,
          total: this.calcularTotal(),
          estado: 'Confirmada'
        }
      }
    });
  }

  irAListadoReservas(): void {
    this.router.navigate(['/reservas']);
  }

  limpiarCotizacion(): void {
    this.pasajeros = 2;
    this.temporadaSeleccionada = 'Media';
    this.serviciosAdicionales.forEach((s) => (s.seleccionado = s.id === 'ADD-SEG'));
  }
}