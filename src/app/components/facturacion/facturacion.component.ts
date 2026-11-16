/* ==========================================================================
   ARCHIVO: src/app/components/facturacion/facturacion.component.ts
   FUNCIÓN: Módulo 5 (Danny Guaman). Facturación, Pagos y Reseñas.
            Gestión de comprobantes y facturas con Angular Material,
            señales (signals), diálogo de edición, diálogo de confirmación
            y alternancia entre Vista Administrador y Vista Cliente.
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { IconoComponent } from '../compartido/icono/icono.component';
import {
  ConfirmacionDialogoComponent,
  DatosConfirmacion
} from '../compartido/confirmacion-dialogo/confirmacion-dialogo.component';
import { FacturacionService, Factura } from '../../services/facturacion.service';
import { FacturacionDialogoComponent } from './facturacion-dialogo/facturacion-dialogo.component';

@Component({
  selector: 'app-modulo-facturacion',
  standalone: true,
  imports: [CommonModule, FormsModule, IconoComponent],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class ModuloFacturacionComponent {
  private facturacionService = inject(FacturacionService);
  private dialog = inject(MatDialog);
  private notificaciones = inject(MatSnackBar);

  // Control de pestaña / vista activa
  vistaActiva: 'admin' | 'cliente' = 'admin';

  // Filtro en tiempo real
  filtro: string = '';

  // Lista de facturas obtenidas desde el signal del servicio
  get facturas(): Factura[] {
    return this.facturacionService.obtenerFacturas();
  }

  // Filtrado reactivo en tiempo real
  get facturasFiltradas(): Factura[] {
    const termino = this.filtro.trim().toLowerCase();
    if (!termino) {
      return this.facturas;
    }
    return this.facturas.filter(f =>
      f.idFactura.toLowerCase().includes(termino) ||
      f.cliente.toLowerCase().includes(termino) ||
      f.paqueteTuristico.toLowerCase().includes(termino) ||
      f.estadoPago.toLowerCase().includes(termino) ||
      f.fechaEmision.toLowerCase().includes(termino)
    );
  }

  readonly rastrearPorId = (_indice: number, item: Factura): string => item.idFactura;

  // Modificar registro mediante diálogo modal
  abrirModificar(factura: Factura): void {
    this.dialog
      .open<FacturacionDialogoComponent, Factura, Factura | null>(FacturacionDialogoComponent, {
        width: '560px',
        maxWidth: '95vw',
        disableClose: true,
        panelClass: 'dialogo-vidrio',
        data: { ...factura }
      })
      .afterClosed()
      .subscribe(resultado => {
        if (resultado) {
          this.facturacionService.actualizarFactura(resultado.idFactura, resultado);
          this.notificaciones.open(
            `Factura "${resultado.idFactura}" modificada exitosamente.`,
            'Cerrar',
            { duration: 4000, horizontalPosition: 'center', verticalPosition: 'bottom' }
          );
        }
      });
  }

  // Eliminar registro previa confirmación
  async eliminar(id: string): Promise<void> {
    const factura = this.facturas.find(f => f.idFactura === id);
    const clienteTexto = factura ? ` del cliente "${factura.cliente}"` : '';

    const confirmado = await firstValueFrom(
      this.dialog
        .open<ConfirmacionDialogoComponent, DatosConfirmacion, boolean>(ConfirmacionDialogoComponent, {
          panelClass: 'dialogo-vidrio',
          data: {
            titulo: 'Eliminar factura',
            mensaje: `¿Estás seguro de que deseas eliminar la factura "${id}"${clienteTexto}? Esta acción no se puede deshacer.`,
            tipo: 'peligro',
            textoConfirmar: 'Sí, eliminar'
          }
        })
        .afterClosed()
    );

    if (confirmado === true) {
      this.facturacionService.eliminarFactura(id);
      this.notificaciones.open(
        `Factura "${id}" eliminada correctamente.`,
        'Cerrar',
        { duration: 4000, horizontalPosition: 'center', verticalPosition: 'bottom' }
      );
    }
  }
}

// Alias de compatibilidad
export { ModuloFacturacionComponent as FacturacionComponent };
