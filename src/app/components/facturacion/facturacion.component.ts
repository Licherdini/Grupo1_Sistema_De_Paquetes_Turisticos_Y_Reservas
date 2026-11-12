
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulo-facturacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facturacion.component.html'
})
export class ModuloFacturacionComponent {
  objetivo: string =
    'Gestionar la simulación de cobros, la emisión de comprobantes de viaje y la recopilación de valoraciones del servicio.';

  funcionesPrevistas: string[] = [
    'Simulación de pasarela de pago: tarjeta, transferencia y abono.',
    'Emisión y previsualización de vouchers y comprobantes de liquidación.',
    'Calificación post-viaje con estrellas (1 a 5) y comentarios.',
    'Métrica consolidada del índice de satisfacción del cliente.'
  ];
}