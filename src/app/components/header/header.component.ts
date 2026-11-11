/* ==========================================================================
   ARCHIVO: src/app/components/header/header.component.ts
   FUNCIÓN: Toolbar dinámico de AndesTravel UG. Muestra "Acerca de" e
            "Iniciar Sesión" sin sesión, o el usuario y "Cerrar Sesión" con
            sesión. En teléfono se despliega desde un botón de hamburguesa.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProyectoInfoService } from '../../services/proyecto-info.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Controla si el menú desplegable (solo visible en teléfono) está abierto
  menuAbierto: boolean = false;

  // Inyección de dependencias: sesión, datos de la empresa y Router
  constructor(
    public authService: AuthService,
    public proyectoInfo: ProyectoInfoService,
    private router: Router
  ) {}

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  irALogin(): void {
    this.cerrarMenu();
    this.router.navigate(['/login']);
  }

  salirDelSistema(): void {
    this.cerrarMenu();
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}