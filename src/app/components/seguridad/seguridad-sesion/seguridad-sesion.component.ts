/* ==========================================================================
   ARCHIVO: seguridad-sesion.component.ts
   FUNCIÓN: Módulo 1, sección "Mi sesión": estado, indicadores y cronómetro de
            la sesión activa, tomados de AuthService.
   ========================================================================== */

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  imports: [CommonModule],
  selector: 'app-seguridad-sesion',
  styleUrl: './seguridad-sesion.component.css',
  templateUrl: './seguridad-sesion.component.html',
})
export class SeguridadSesionComponent implements OnInit, OnDestroy {
  // Es un signal porque cambia dentro de un temporizador (la app no usa zone.js)
  duracionSesion = signal<string>('00:00:00');

  private temporizador: ReturnType<typeof setInterval> | undefined;

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