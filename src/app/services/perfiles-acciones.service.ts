/* ==========================================================================
   ARCHIVO: src/app/services/perfiles-acciones.service.ts
   FUNCIÓN: Módulo 1. Flujos de diálogo del CRUD de perfiles (crear, modificar,
            eliminar, cambiar estado). Los reutilizan la tabla y la ficha.
   ========================================================================== */

import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { AuthService, PerfilUsuario } from './auth.service';
import {
  ConfirmacionDialogoComponent,
  DatosConfirmacion
} from '../components/compartido/confirmacion-dialogo/confirmacion-dialogo.component';
import { SeguridadPerfilDialogoComponent } from '../components/seguridad/seguridad-perfil-dialogo/seguridad-perfil-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class PerfilesAccionesService {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notificaciones = inject(MatSnackBar);

  // Abre el diálogo en modo crear (sin perfil seleccionado)
  crear(): void {
    this.authService.perfilSeleccionado.set(null);
    this.abrirFormulario();
  }

  // Abre el diálogo con los datos del perfil para modificarlo
  modificar(perfil: PerfilUsuario): void {
    this.authService.perfilSeleccionado.set(perfil);
    this.abrirFormulario();
  }

  // Eliminado lógico con advertencia. Devuelve true si el perfil se eliminó.
  async eliminar(perfil: PerfilUsuario): Promise<boolean> {
    const motivo = this.authService.motivoProtegido(perfil.usuario);
    if (motivo) {
      await this.confirmar({
        titulo: 'No se puede eliminar',
        mensaje: `El perfil "${perfil.usuario}" no se puede eliminar porque ${motivo}`,
        tipo: 'informacion',
        textoConfirmar: 'Entendido',
        textoCancelar: null
      });
      return false;
    }

    const confirmado = await this.confirmar({
      titulo: 'Eliminar perfil',
      mensaje:
        `Se eliminará el perfil "${perfil.usuario}" (${perfil.nombreCompleto}). ` +
        'Dejará de mostrarse y no podrá iniciar sesión. ¿Deseas continuar?',
      tipo: 'peligro',
      textoConfirmar: 'Sí, eliminar'
    });
    if (!confirmado) {
      return false;
    }

    const eliminado = this.authService.eliminarPerfil(perfil.usuario);
    if (eliminado) {
      this.notificar(`Perfil "${perfil.usuario}" eliminado correctamente.`);
    }
    return eliminado;
  }

  // Alterna Activo <-> Bloqueado con confirmación
  async cambiarEstado(perfil: PerfilUsuario): Promise<boolean> {
    const motivo = this.authService.motivoProtegido(perfil.usuario);
    if (motivo) {
      await this.confirmar({
        titulo: 'No se puede cambiar el estado',
        mensaje: `El estado del perfil "${perfil.usuario}" no se puede cambiar porque ${motivo}`,
        tipo: 'informacion',
        textoConfirmar: 'Entendido',
        textoCancelar: null
      });
      return false;
    }

    const nuevoEstado = perfil.estado === 'Activo' ? 'Bloqueado' : 'Activo';
    const confirmado = await this.confirmar({
      titulo: nuevoEstado === 'Bloqueado' ? 'Bloquear cuenta' : 'Activar cuenta',
      mensaje: `La cuenta de "${perfil.usuario}" pasará de ${perfil.estado} a ${nuevoEstado}. ¿Deseas continuar?`,
      tipo: 'advertencia',
      textoConfirmar: 'Sí, continuar'
    });
    if (!confirmado) {
      return false;
    }

    this.authService.actualizarPerfil(perfil.usuario, { estado: nuevoEstado });
    this.notificar(`Cuenta de "${perfil.usuario}" cambiada a ${nuevoEstado}.`);
    return true;
  }

  private abrirFormulario(): void {
    this.dialog.open(SeguridadPerfilDialogoComponent, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });
  }

  private async confirmar(datos: DatosConfirmacion): Promise<boolean> {
    const resultado = await firstValueFrom(
      this.dialog
        .open<ConfirmacionDialogoComponent, DatosConfirmacion, boolean>(ConfirmacionDialogoComponent, {
          data: datos,
          panelClass: 'dialogo-vidrio'
        })
        .afterClosed()
    );
    return resultado === true;
  }

  private notificar(mensaje: string): void {
    this.notificaciones.open(mensaje, 'Cerrar', {
      duration: 4000,
      panelClass: ['snack-exito'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}