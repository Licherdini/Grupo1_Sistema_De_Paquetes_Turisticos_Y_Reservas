/* ==========================================================================
   ARCHIVO: proveedores-directorio.component.ts
   MÓDULO 3: Gestión de Proveedores y Hospedaje (Sebastián Acosta Andrade)
   FUNCIÓN: Sección "Directorio de Proveedores" (/proveedores/directorio).
            CRUD completo de convenios con aerolíneas y transporte terrestre:
            - READ   : tabla con input de filtro superior + filtros combinados
                       de ciudad, tipo y estado.
            - CREATE : formulario desplegable.
            - UPDATE : ventana sobrepuesta (MatDialog con panelClass 'dialogo-vidrio')
                       que recupera los datos y actualiza la tabla reactivamente.
            - DELETE : ventana modal sobrepuesta de confirmación (ConfirmacionDialogoComponent).
            Todos los datos residen en ProveedoresService.
   ========================================================================== */

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconoComponent } from '../../compartido/icono/icono.component';

// Servicio de datos reactivo
import {
  ProveedoresService,
  ConvenioProveedor,
  BorradorProveedor,
  TipoProveedor,
  EstadoConvenio
} from '../../../services/proveedores.service';

// Diálogo modal sobrepuesto para modificar
import { ProveedoresEditDialogComponent } from '../proveedores-edit-dialog/proveedores-edit-dialog.component';

// Diálogo modal sobrepuesto para confirmaciones
import { ConfirmacionDialogoComponent } from '../../compartido/confirmacion-dialogo/confirmacion-dialogo.component';

@Component({
  imports: [CommonModule, FormsModule, IconoComponent],
  selector: 'app-proveedores-directorio',
  styleUrl: './proveedores-directorio.component.css',
  templateUrl: './proveedores-directorio.component.html',
})
export class ProveedoresDirectorioComponent {
  protected readonly svc = inject(ProveedoresService);
  private readonly dialog = inject(MatDialog);

  // Opciones de configuración
  readonly tiposProveedor: TipoProveedor[] = ['Aerolínea', 'Transporte Terrestre'];
  readonly estadosConvenio: EstadoConvenio[] = ['Activo', 'Suspendido', 'En Renovación'];
  readonly ciudadesDestino: string[] = [
    'Galápagos', 'Cuenca', 'Baños', 'Manta', 'Loja',
    'Esmeraldas', 'Ambato', 'Quito', 'Guayaquil', 'Montañita'
  ];
  readonly unidades: Array<'por trayecto' | 'por persona'> = ['por trayecto', 'por persona'];

  // Two-way binding de filtros
  filtroTexto: string = '';
  filtroCiudad: string = 'Todas';
  filtroTipo: string = 'Todos';
  filtroEstado: string = 'Todos';

  // Control de formulario de registro
  mostrarFormulario: boolean = false;
  nuevoProveedor: BorradorProveedor = this.crearBorrador();

  // Filtrado computado en tiempo real (Signals)
  proveedoresFiltrados = computed(() => {
    const texto = this.filtroTexto.trim().toLowerCase();
    return this.svc.proveedores().filter((p) => {
      const coincideTexto =
        texto === '' ||
        p.nombre.toLowerCase().includes(texto) ||
        p.ciudad.toLowerCase().includes(texto) ||
        p.tipo.toLowerCase().includes(texto);
      const coincideCiudad = this.filtroCiudad === 'Todas' || p.ciudad === this.filtroCiudad;
      const coincideTipo = this.filtroTipo === 'Todos' || p.tipo === this.filtroTipo;
      const coincideEstado = this.filtroEstado === 'Todos' || p.estado === this.filtroEstado;
      return coincideTexto && coincideCiudad && coincideTipo && coincideEstado;
    });
  });

  limpiarFiltro(): void {
    this.filtroTexto = '';
    this.filtroCiudad = 'Todas';
    this.filtroTipo = 'Todos';
    this.filtroEstado = 'Todos';
  }

  formularioValido(): boolean {
    const p = this.nuevoProveedor;
    return (
      p.nombre.trim().length >= 4 &&
      this.ciudadesDestino.includes(p.ciudad) &&
      (p.tarifaCorporativa ?? 0) > 0
    );
  }

  registrarProveedor(): void {
    if (!this.formularioValido()) return;
    this.svc.registrarProveedor(this.nuevoProveedor);
    this.nuevoProveedor = this.crearBorrador();
    this.mostrarFormulario = false;
  }

  // Abre la ventanita modal sobrepuesta para editar (igual que en Módulo 1)
  abrirDialogEdicion(proveedor: ConvenioProveedor): void {
    const ref = this.dialog.open(ProveedoresEditDialogComponent, {
      data: { proveedor },
      width: '580px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'dialogo-vidrio'
    });

    ref.afterClosed().subscribe((resultado: ConvenioProveedor | null) => {
      if (resultado) {
        this.svc.actualizarProveedor(proveedor.id, resultado);
      }
    });
  }

  // Abre la ventanita modal sobrepuesta para confirmar eliminación
  eliminar(proveedor: ConvenioProveedor): void {
    this.dialog
      .open(ConfirmacionDialogoComponent, {
        data: {
          titulo: 'Eliminar convenio',
          mensaje: `Se eliminará el convenio con "${proveedor.nombre}" (${proveedor.ciudad}). ¿Deseas continuar?`,
          tipo: 'peligro',
          textoConfirmar: 'Sí, eliminar'
        },
        panelClass: 'dialogo-vidrio'
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.svc.eliminarProveedor(proveedor.id);
        }
      });
  }

  claseBadgeEstado(estado: EstadoConvenio): string {
    return this.svc.claseBadgeEstado(estado);
  }

  claseBadgeTipo(tipo: TipoProveedor): string {
    return this.svc.claseBadgeTipo(tipo);
  }

  iconoTipo(tipo: TipoProveedor): string {
    return this.svc.iconoTipo(tipo);
  }

  private crearBorrador(): BorradorProveedor {
    return {
      nombre: '',
      tipo: 'Aerolínea',
      ciudad: 'Galápagos',
      tarifaCorporativa: null,
      unidadTarifa: 'por trayecto',
      frecuencias: '',
      estado: 'Activo'
    };
  }
}
