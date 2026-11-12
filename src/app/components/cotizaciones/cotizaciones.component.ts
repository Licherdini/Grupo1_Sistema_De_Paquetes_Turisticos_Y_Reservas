
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulo-cotizaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cotizaciones.component.html'
})
export class ModuloCotizacionesComponent {
  objetivo: string =
    'Proporcionar un calculador de tarifas en tiempo real y coordinar el bloqueo de cupos para los usuarios.';

  funcionesPrevistas: string[] = [
    'Formulario para fechas de viaje, paquete seleccionado y número de pasajeros.',
    'Cálculo dinámico del presupuesto total con funciones TypeScript tipadas.',
    'Servicios adicionales: seguro de viaje, excursiones nocturnas, upgrade de habitación.',
    'Pre-reserva con código único y bloqueo temporal de cupos.'
  ];
}