
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulo-proveedores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proveedores.component.html'
})
export class ModuloProveedoresComponent {
  objetivo: string =
    'Centralizar los convenios con aliados estratégicos del sector turístico asociados a cada paquete de viaje.';

  funcionesPrevistas: string[] = [
    'Convenios con aerolíneas y empresas de transporte terrestre turístico.',
    'Cadenas hoteleras aliadas por estrellas, tipo de acomodación y ubicación.',
    'Asignación de guías turísticos certificados y bilingües según la ruta.',
    'Panel de convenios activos y disponibilidad de logística por temporada.'
  ];
}