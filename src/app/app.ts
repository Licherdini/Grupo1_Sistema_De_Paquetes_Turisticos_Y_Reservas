/* ==========================================================================
   ARCHIVO: src/app/app.ts
   FUNCIÓN: Componente raíz que contiene el Toolbar (Header), el contenedor
            de vistas (<router-outlet>) y el Footer de AndesTravel UG.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Datos institucionales del proyecto elegido (Interpolación {{ }})
  nombreEmpresa: string = 'AndesTravel UG';
  subtituloEmpresa: string = 'Paquetes Turísticos, Cotizaciones y Reservas Multidestino';
  anioActual: number = new Date().getFullYear();
  integrantes: string =
    'Jhon Herrera Merchán, Angie López Mena, Sebastián Acosta Andrade, Kenny Ormaza Padilla y Danny Guaman Yucailla';

  // Inyección de dependencias del Servicio global y del Router
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  irALogin(): void {
    this.router.navigate(['/login']);
  }




  salirDelSistema(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}