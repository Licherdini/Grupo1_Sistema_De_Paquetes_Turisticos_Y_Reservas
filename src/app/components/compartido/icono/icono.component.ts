/* ==========================================================================
   ARCHIVO: src/app/components/compartido/icono/icono.component.ts
   FUNCIÓN: Icono SVG reutilizable (reemplaza a los emojis). Dibuja el icono
            con trazos de color "currentColor": hereda el color y el tamaño
            (font-size) del elemento que lo contiene, en cualquier navegador.
            Uso: <app-icono nombre="candado" />
   ========================================================================== */

import { Component, computed, input } from '@angular/core';

export type NombreIcono =
  | 'candado' | 'buscar' | 'flecha-izquierda' | 'mas' | 'cerrar' | 'check'
  | 'advertencia' | 'papelera' | 'informacion' | 'exito' | 'editar'
  | 'ubicacion' | 'calendario' | 'tarjeta' | 'cupon' | 'brujula' | 'hotel'
  | 'cama' | 'cubiertos' | 'avion' | 'bus' | 'estrella' | 'usuario';

// Cada icono es una lista de trazos SVG en una cuadrícula de 24 x 24
const TRAZOS: Record<NombreIcono, string[]> = {
  candado: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  buscar: ['M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z', 'M21 21l-4.35-4.35'],
  'flecha-izquierda': ['M19 12H5', 'M12 19l-7-7 7-7'],
  mas: ['M12 5v14', 'M5 12h14'],
  cerrar: ['M18 6L6 18', 'M6 6l12 12'],
  check: ['M20 6L9 17l-5-5'],
  advertencia: [
    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    'M12 9v4', 'M12 17h.01'
  ],
  papelera: ['M3 6h18', 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M10 11v6', 'M14 11v6'],
  informacion: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 16v-4', 'M12 8h.01'],
  exito: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3'],
  editar: ['M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'],
  ubicacion: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  calendario: ['M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  tarjeta: ['M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M1 10h22'],
  cupon: [
    'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z',
    'M13 5v2', 'M13 11v2', 'M13 17v2'
  ],
  brujula: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
  hotel: ['M3 21h18', 'M5 21V7l8-4v18', 'M19 21V11l-6-4', 'M9 9v.01', 'M9 12v.01', 'M9 15v.01', 'M9 18v.01'],
  cama: ['M2 4v16', 'M2 8h18a2 2 0 0 1 2 2v10', 'M2 17h20', 'M6 8v9'],
  cubiertos: ['M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2', 'M7 2v20', 'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7'],
  avion: [
    'M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z'
  ],
  bus: [
    'M8 6v6', 'M15 6v6', 'M2 12h19.6',
    'M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3',
    'M9 18h5', 'M7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'M16 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'
  ],
  estrella: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  usuario: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z']
};

@Component({
  selector: 'app-icono',
  standalone: true,
  templateUrl: './icono.component.html',
  styleUrl: './icono.component.css'
})
export class IconoComponent {
  // Nombre del icono (obligatorio) y, opcional, relleno sólido (útil para estrellas)
  nombre = input.required<NombreIcono>();
  relleno = input<boolean>(false);

  trazos = computed<string[]>(() => TRAZOS[this.nombre()] ?? []);
}