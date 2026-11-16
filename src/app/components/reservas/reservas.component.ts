import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PreReserva, ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  public reservasService = inject(ReservasService);
  public authService = inject(AuthService);
  private router = inject(Router);

  // Navegación superior tipo pill
  tabActiva: 'cotizador' | 'reservas' = 'reservas';

  // Filtros reactivos en tiempo real (READ)
  public textoBusqueda = signal<string>('');
  public regionFiltro = signal<string>('Todas');

  // Estado temporal para edición (UPDATE)
  public codigoEnEdicion = signal<string | null>(null);
  public pasajerosEdit = signal<number>(1);
  public estadoEdit = signal<'Confirmada' | 'Pendiente' | 'Modificada'>('Confirmada');

  ngOnInit(): void {
    // Captura nueva reserva enviada por state desde el cotizador si aplica
    const nuevaReserva = history.state?.['nuevaReserva'] as Partial<PreReserva> | undefined;
    if (nuevaReserva && nuevaReserva.paqueteNombre) {
      // Ya se registra en el servicio al hacer clic en generar
    }
  }

  // Filtrado reactivo combinado por texto y región
  public reservasFiltradas = computed(() => {
    const termino = this.textoBusqueda().trim().toLowerCase();
    const region = this.regionFiltro();

    return this.reservasService.reservas().filter((reserva) => {
      const coincideRegion = region === 'Todas' || reserva.region === region;
      const coincideTexto =
        !termino ||
        reserva.codigo.toLowerCase().includes(termino) ||
        reserva.cliente.toLowerCase().includes(termino) ||
        reserva.paqueteNombre.toLowerCase().includes(termino) ||
        reserva.estado.toLowerCase().includes(termino);

      return coincideRegion && coincideTexto;
    });
  });

  public iniciarEdicion(reserva: PreReserva): void {
    this.codigoEnEdicion.set(reserva.codigo);
    this.pasajerosEdit.set(reserva.pasajeros);
    this.estadoEdit.set(reserva.estado);
  }

  public guardarEdicion(codigo: string): void {
    this.reservasService.actualizarReserva(codigo, this.pasajerosEdit(), this.estadoEdit());
    this.cancelarEdicion();
  }

  public cancelarEdicion(): void {
    this.codigoEnEdicion.set(null);
  }

  public eliminar(codigo: string): void {
    if (confirm(`¿Está seguro de eliminar la reserva ${codigo}? Se liberarán los cupos correspondientes.`)) {
      this.reservasService.eliminarReserva(codigo);
    }
  }

  public irACotizador(): void {
    this.tabActiva = 'cotizador';
    this.router.navigate(['/principal'], { queryParams: { modulo: 4 } });
  }

  public seleccionarReservas(): void {
    this.tabActiva = 'reservas';
  }

  public volverAlPanel(): void {
    this.router.navigate(['/principal']);
  }
}