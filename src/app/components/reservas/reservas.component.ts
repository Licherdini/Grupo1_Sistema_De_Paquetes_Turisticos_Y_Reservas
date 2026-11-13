import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface ReservaGenerada {
  codigo: string;
  titular: string;
  destino: string;
  pasajeros: number;
  total: number;
  estado: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  private readonly storageKey = 'andestravel_reservas_2026';
  tabActiva: 'cotizador' | 'reservas' = 'reservas';

  reservas: ReservaGenerada[] = [
    {
      codigo: 'RES-2026-01',
      titular: 'ADMIN',
      destino: 'Galápagos Imperial (5D/4N)',
      pasajeros: 2,
      total: 1398,
      estado: 'Confirmada'
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const guardadas = sessionStorage.getItem(this.storageKey);
    if (guardadas) {
      try {
        this.reservas = JSON.parse(guardadas) as ReservaGenerada[];
      } catch {
        sessionStorage.removeItem(this.storageKey);
      }
    }

    const nuevaReserva = history.state?.['nuevaReserva'] as Partial<ReservaGenerada> | undefined;
    if (nuevaReserva && nuevaReserva.destino) {
      const siguienteNumero = String(this.reservas.length + 1).padStart(2, '0');
      const registroCompleto: ReservaGenerada = {
        codigo: nuevaReserva.codigo || `RES-2026-${siguienteNumero}`,
        titular: (nuevaReserva.titular || this.authService.usuarioActual() || 'ADMIN').toUpperCase(),
        destino: nuevaReserva.destino,
        pasajeros: Number(nuevaReserva.pasajeros) || 1,
        total: Math.round(Number(nuevaReserva.total) || 0),
        estado: nuevaReserva.estado || 'Confirmada'
      };

      const yaExiste = this.reservas.some((r) => r.codigo === registroCompleto.codigo);
      if (!yaExiste) {
        this.reservas.push(registroCompleto);
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.reservas));
      }
    }
  }

  irACotizador(): void {
    this.tabActiva = 'cotizador';
    this.router.navigate(['/principal']);
  }

  seleccionarReservas(): void {
    this.tabActiva = 'reservas';
  }

  volverAlPanel(): void {
    this.router.navigate(['/principal']);
  }
}