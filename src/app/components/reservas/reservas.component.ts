import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { PreReserva, ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';
import {
  ConfirmacionDialogoComponent,
  DatosConfirmacion
} from '../compartido/confirmacion-dialogo/confirmacion-dialogo.component';
import { IconoComponent } from '../compartido/icono/icono.component';
import { ReservasEditDialogComponent } from './reservas-edit-dialog/reservas-edit-dialog.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, IconoComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {
  public reservasService = inject(ReservasService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Filtros reactivos en tiempo real (READ)
  public textoBusqueda = signal<string>('');
  public regionFiltro = signal<string>('Todas');

  // Estado temporal para edición (UPDATE)
  public codigoEnEdicion = signal<string | null>(null);
  public pasajerosEdit = signal<number>(1);
  public estadoEdit = signal<'Confirmada' | 'Pendiente' | 'Modificada'>('Confirmada');

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

  // Abre la ventanita modal sobrepuesta para editar (igual que en Módulo 3 y Módulo 1)
  public abrirDialogEdicion(reserva: PreReserva): void {
    const ref = this.dialog.open(ReservasEditDialogComponent, {
      data: { reserva },
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    ref.afterClosed().subscribe((resultado: PreReserva | null) => {
      if (resultado) {
        this.reservasService.actualizarReservaCompleta(reserva.codigo, resultado);
        this.snackBar.open(
          `Reserva ${resultado.codigo} de "${resultado.cliente}" actualizada correctamente.`,
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snack-exito'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      }
    });
  }

  public iniciarEdicion(reserva: PreReserva): void {
    this.abrirDialogEdicion(reserva);
  }

  public guardarEdicion(codigo: string): void {
    this.reservasService.actualizarReserva(codigo, this.pasajerosEdit(), this.estadoEdit());
    this.codigoEnEdicion.set(null);
    this.snackBar.open(`Reserva ${codigo} actualizada correctamente.`, 'Cerrar', {
      duration: 3500,
      panelClass: ['snack-exito'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  public cancelarEdicion(): void {
    const cod = this.codigoEnEdicion();
    this.codigoEnEdicion.set(null);
    if (cod) {
      this.reservasService.mensajeNotificacion.set(`Edición de la reserva "${cod}" cancelada.`);
      setTimeout(() => this.reservasService.mensajeNotificacion.set(''), 3000);
    } else {
      this.reservasService.mensajeNotificacion.set('');
    }
  }

  public async eliminar(codigo: string): Promise<void> {
    const confirmado = await firstValueFrom(
      this.dialog
        .open<ConfirmacionDialogoComponent, DatosConfirmacion, boolean>(
          ConfirmacionDialogoComponent,
          {
            data: {
              titulo: 'Eliminar reserva',
              mensaje: `¿Está seguro de eliminar la reserva ${codigo}? Se liberarán los cupos correspondientes.`,
              tipo: 'peligro',
              textoConfirmar: 'Sí, eliminar'
            },
            panelClass: 'dialogo-vidrio'
          }
        )
        .afterClosed()
    );

    if (confirmado === true) {
      this.reservasService.eliminarReserva(codigo);
    }
  }

  public irACotizador(): void {
    this.router.navigate(['/cotizaciones', 'cotizador']);
  }
}
