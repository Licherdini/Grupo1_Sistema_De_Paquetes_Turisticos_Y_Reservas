/* ==========================================================================
   ARCHIVO: src/app/services/proyecto-info.service.ts
   FUNCIÓN: Fuente única de los datos institucionales del proyecto, compartida
            por Login, Header y Footer
   ========================================================================== */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProyectoInfoService {
  public nombreEmpresa: string = 'AndesTravel UG';
  public subtituloEmpresa: string = 'Paquetes Turísticos, Cotizaciones y Reservas Multidestino';
  public integrantes: string =
    'Jhon Herrera Merchán, Angie Lopez Mena, Sebastián Acosta Andrade, Kenny Ormaza Padilla y Danny Guaman Yucailla';
  public anioActual: number = new Date().getFullYear();
}