/* ==========================================================================
   ARCHIVO: src/app/components/login/login.component.ts
   FUNCIÓN: Valida internamente el usuario y clave usando AuthService,
            muestra el mensaje correspondiente y redirige a /principal.
   ========================================================================== */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  nombreEmpresa: string = 'AndesTravel UG';

  //Propiedades vinculadas con two-way data binding en el formulario de login
  usuario: string = '';
  clave: string = '';
  mostrarClave: boolean = false;

  //Control de mensajes en pantalla
  mensajeEstado: string = '';
  esAccesoConcedido: boolean = false;

  //Inyección del servicio globla y del router para redirección
  constructor(
    public authService: AuthService,
    private router: Router
  ){}

  validarCredenciales(): void {
    //1. Validar si deja campos vacíos
    if(this.usuario.trim() === '' || this.clave.trim() === ''){
      this.esAccesoConcedido = false;
      this.mensajeEstado = 'Por favor, complete todos los campos.';
      return;
    }

    //2. Validar credenciales contra las variables pubicas del servicio AuthService
    const accesoCorrecto = this.authService.validarAcceso(this.usuario, this.clave);

    if(accesoCorrecto){
      this.esAccesoConcedido = true;
      this.mensajeEstado = 'Acceso concedido. Redirigiendo a AndesTravel UG';
      //pausa breve antes de redirigir a la vista principal
      setTimeout(() => this.router.navigate(['/principal']), 900);
    }else{
      this.esAccesoConcedido = false;
      this.mensajeEstado = 'Acceso denegado. Usuario o clave incorrectos.';
    }
  }


  limpiarError(): void {
   if(!this.esAccesoConcedido && this.mensajeEstado){
    this.mensajeEstado = '';
   }
  }

  alternarVistaClave(): void {
    this.mostrarClave = !this.mostrarClave;
  }
}