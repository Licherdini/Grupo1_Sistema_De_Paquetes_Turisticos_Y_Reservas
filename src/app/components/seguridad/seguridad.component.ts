/* ==========================================================================
   ARCHIVO: src/app/components/seguridad/seguridad.component.ts
   FUNCIÓN: Módulo 1 (Jhon Herrera Merchán). Panel de sesión activa, perfiles
            registrados y registro de accesos, todo alimentado por AuthService.
   ========================================================================== */

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegistroAcceso } from '../../services/auth.service';

@Component({
  selector: 'app-modulo-seguridad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.css'
})
export class ModuloSeguridadComponent implements OnInit, OnDestroy {
  // Two-way binding del filtro de la tabla de accesos
  filtroAccesos: string = '';

  // Es un signal porque cambia dentro de un temporizador (la app no usa zone.js)
  duracionSesion = signal<string>('00:00:00');

  private temporizador: ReturnType<typeof setInterval> | undefined;

  // Inyección de dependencias: servicio global de sesión y Router
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarDuracion();
    this.temporizador = setInterval(() => this.actualizarDuracion(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }

  // Filtro en tiempo real del registro de accesos: por usuario o por resultado
  accesosFiltrados(): RegistroAcceso[] {
    const texto = this.filtroAccesos.trim().toLowerCase();
    const accesos = this.authService.registroAccesos();
    if (texto === '') {
      return accesos;
    }
    return accesos.filter(
      (acceso) =>
        acceso.usuario.toLowerCase().includes(texto) ||
        (acceso.exitoso ? 'exitoso' : 'fallido').includes(texto)
    );
  }

  // Event binding (click): cierra la sesión y vuelve al login
  salirDelSistema(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  private actualizarDuracion(): void {
    const inicio = this.authService.horaInicioSesion();
    if (!inicio) {
      this.duracionSesion.set('00:00:00');
      return;
    }
    const segundosTotales = Math.max(0, Math.floor((Date.now() - inicio.getTime()) / 1000));
    const horas = Math.floor(segundosTotales / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;
    this.duracionSesion.set(
      `${this.dosDigitos(horas)}:${this.dosDigitos(minutos)}:${this.dosDigitos(segundos)}`
    );
  }

  private dosDigitos(numero: number): string {
    return numero.toString().padStart(2, '0');
  }
}