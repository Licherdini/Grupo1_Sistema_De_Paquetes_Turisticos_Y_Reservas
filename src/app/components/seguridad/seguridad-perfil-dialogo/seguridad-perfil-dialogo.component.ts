/* ==========================================================================
   ARCHIVO: seguridad-perfil-dialogo.component.ts
   FUNCIÓN: Módulo 1. Diálogo (MatDialog) para CREAR o MODIFICAR un perfil.
            Recupera el perfil elegido desde AuthService.perfilSeleccionado
            (null = modo crear), valida, pide confirmación y guarda en el servicio.
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, EstadoCuenta, PerfilUsuario, RolUsuario } from '../../../services/auth.service';
import { ConfirmacionDialogoComponent } from '../../compartido/confirmacion-dialogo/confirmacion-dialogo.component';

@Component({
  selector: 'app-seguridad-perfil-dialogo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './seguridad-perfil-dialogo.component.html',
  styleUrl: './seguridad-perfil-dialogo.component.css'
})
export class SeguridadPerfilDialogoComponent {
  private authService = inject(AuthService);
  private dialogRef = inject<MatDialogRef<SeguridadPerfilDialogoComponent, boolean>>(MatDialogRef);
  private dialog = inject(MatDialog);
  private notificaciones = inject(MatSnackBar);

  // Recupera la información del perfil seleccionado en la tabla
  readonly perfilOriginal: PerfilUsuario | null = this.authService.perfilSeleccionado();
  readonly modo: 'crear' | 'editar' = this.perfilOriginal ? 'editar' : 'crear';

  readonly roles: RolUsuario[] = ['Administrador', 'Agente de viajes', 'Auditor'];
  readonly estados: EstadoCuenta[] = ['Activo', 'Bloqueado', 'Inactivo'];

  // Two-way binding del formulario
  usuario: string = this.perfilOriginal?.usuario ?? '';
  nombreCompleto: string = this.perfilOriginal?.nombreCompleto ?? '';
  rol: RolUsuario = this.perfilOriginal?.rol ?? 'Agente de viajes';
  estado: EstadoCuenta = this.perfilOriginal?.estado ?? 'Activo';
  clave: string = '';
  mostrarClave: boolean = false;

  // Si el perfil es protegido (admin base o sesión activa) no se le cambia el estado
  readonly motivoProtegido: string | null = this.perfilOriginal
    ? this.authService.motivoProtegido(this.perfilOriginal.usuario)
    : null;

  get usuarioDuplicado(): boolean {
    return this.modo === 'crear' && this.authService.usuarioExiste(this.usuario);
  }

  get usuarioValido(): boolean {
    return /^[A-Za-z0-9._-]{3,20}$/.test(this.usuario.trim());
  }

  get claveValida(): boolean {
    // En edición la clave es opcional (vacía = no cambiarla)
    return this.modo === 'editar' ? this.clave === '' || this.clave.trim().length >= 4 : this.clave.trim().length >= 4;
  }

  get formularioValido(): boolean {
    return (
      this.usuarioValido &&
      !this.usuarioDuplicado &&
      this.nombreCompleto.trim().length >= 3 &&
      this.claveValida
    );
  }

  // Event binding (click en Guardar): primero pide confirmación
  guardar(): void {
    if (!this.formularioValido) {
      return;
    }
    const crear = this.modo === 'crear';
    this.dialog
      .open(ConfirmacionDialogoComponent, {
        panelClass: 'dialogo-vidrio',
        data: {
          titulo: crear ? 'Crear perfil' : 'Guardar cambios',
          mensaje: crear
            ? `Se creará el perfil "${this.usuario.trim()}" con rol ${this.rol}. ¿Deseas continuar?`
            : `Se actualizarán los datos del perfil "${this.usuario}". ¿Deseas continuar?`,
          tipo: 'advertencia',
          textoConfirmar: crear ? 'Sí, crear' : 'Sí, guardar'
        }
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (confirmado) {
          this.aplicar();
        }
      });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  private aplicar(): void {
    const datos = {
      usuario: this.usuario,
      nombreCompleto: this.nombreCompleto,
      rol: this.rol,
      estado: this.estado,
      clave: this.clave
    };
    const correcto =
      this.modo === 'crear'
        ? this.authService.crearPerfil(datos)
        : this.authService.actualizarPerfil(this.usuario, datos);

    if (correcto) {
      this.notificaciones.open(
        this.modo === 'crear'
          ? `Perfil "${this.usuario.trim()}" creado correctamente.`
          : `Perfil "${this.usuario}" actualizado correctamente.`,
        'Cerrar',
        { duration: 4000, panelClass: ['snack-exito'], horizontalPosition: 'center', verticalPosition: 'bottom' }
      );
      this.dialogRef.close(true);
    }
  }
}