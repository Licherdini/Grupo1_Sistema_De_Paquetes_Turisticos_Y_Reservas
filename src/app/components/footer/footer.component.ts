/* ==========================================================================
   ARCHIVO: src/app/components/footer/footer.component.ts
   FUNCIÓN: Pie de página institucional con copyright y autoría del grupo.
   ========================================================================== */

import { Component } from '@angular/core';
import { ProyectoInfoService } from '../../services/proyecto-info.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(public proyectoInfo: ProyectoInfoService) {}
}