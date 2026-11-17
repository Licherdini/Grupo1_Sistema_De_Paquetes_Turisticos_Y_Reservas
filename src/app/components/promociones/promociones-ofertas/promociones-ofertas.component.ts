/* ==========================================================================
   ARCHIVO: promociones-ofertas.component.ts
   MÓDULO 6: Promociones y Cupones (Matews Abrahan Narvaez Cabeza).
   FUNCIÓN: Sección "Ofertas de Temporada" (/promociones/ofertas). Gestión de
            campañas relámpago con filtro por alianza bancaria conectada al
            servicio centralizado PromocionesService.
   ========================================================================== */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconoComponent } from '../../compartido/icono/icono.component';
import {
  CampanaOferta,
  PromocionesService
} from '../../../services/promociones.service';

export interface BorradorCampana {
  titulo: string;
  alianza: string;
  descuento: number | null;
  codigo: string;
}

@Component({
  selector: 'app-promociones-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule, IconoComponent],
  templateUrl: './promociones-ofertas.component.html',
  styleUrl: './promociones-ofertas.component.css'
})
export class PromocionesOfertasComponent {
  public promocionesService = inject(PromocionesService);
  private router = inject(Router);

  readonly alianzas: string[] = [
    'Banco Pacífico — Diferido sin intereses',
    'Banco Pichincha — Descuento directo',
    'Transferencia / Deuna'
  ];
  readonly descuentoMinimo: number = 5;
  readonly descuentoMaximo: number = 70;
  private readonly diasPorDefecto: number = 15;

  // Filtro por alianza ('Todos' = sin filtro)
  filtroAlianza: string = 'Todos';

  // Formulario reactivo embebido
  nuevaCampana: BorradorCampana = this.crearBorrador();

  get campanas(): CampanaOferta[] {
    return this.promocionesService.campanas();
  }

  set campanas(lista: CampanaOferta[]) {
    this.promocionesService.campanas.set(lista);
  }

  get mensajeNotificacion() {
    return this.promocionesService.mensajeNotificacion;
  }

  campanasFiltradas(): CampanaOferta[] {
    return this.filtroAlianza === 'Todos'
      ? this.campanas
      : this.campanas.filter((campana) => campana.alianza === this.filtroAlianza);
  }

  codigoNormalizado(): string {
    return (this.nuevaCampana.codigo || '').toUpperCase().replace(/\s+/g, '');
  }

  codigoRepetido(): boolean {
    const codigo = this.codigoNormalizado();
    return codigo !== '' && this.campanas.some((campana) => campana.codigo === codigo);
  }

  formularioValido(): boolean {
    const borrador = this.nuevaCampana;
    const descuento = Number(borrador.descuento);
    return (
      borrador.titulo.trim().length >= 5 &&
      this.alianzas.includes(borrador.alianza) &&
      descuento >= this.descuentoMinimo &&
      descuento <= this.descuentoMaximo &&
      this.codigoNormalizado().length >= 3 &&
      !this.codigoRepetido()
    );
  }

  // CREATE: Registrar y publicar campaña
  publicarCampana(): void {
    if (!this.formularioValido()) return;

    this.promocionesService.crearCampana({
      titulo: this.nuevaCampana.titulo.trim(),
      descripcion: 'Campaña vigente de AndesTravel UG para paquetes seleccionados.',
      alianza: this.nuevaCampana.alianza,
      descuento: Number(this.nuevaCampana.descuento),
      codigo: this.codigoNormalizado(),
      diasRestantes: this.diasPorDefecto
    });

    this.nuevaCampana = this.crearBorrador();
  }

  // DELETE: Finalizar campaña
  finalizarCampana(campana: CampanaOferta): void {
    this.promocionesService.eliminarCampana(campana.id);
  }

  gestionarCupon(campana: CampanaOferta): void {
    this.router.navigate(['/promociones', 'cupones'], { queryParams: { codigo: campana.codigo } });
  }

  esUltimosDias(campana: CampanaOferta): boolean {
    return campana.diasRestantes <= 3;
  }

  private crearBorrador(): BorradorCampana {
    return { titulo: '', alianza: this.alianzas[0], descuento: null, codigo: '' };
  }
}
