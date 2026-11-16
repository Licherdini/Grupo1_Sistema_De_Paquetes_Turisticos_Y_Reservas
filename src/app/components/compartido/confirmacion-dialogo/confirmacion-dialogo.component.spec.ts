import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmacionDialogoComponent, DatosConfirmacion } from './confirmacion-dialogo.component';

describe('ConfirmacionDialogoComponent', () => {
  async function crear(datos: DatosConfirmacion) {
    TestBed.configureTestingModule({
      imports: [ConfirmacionDialogoComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: datos },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
      ],
    });
    const fixture = TestBed.createComponent(ConfirmacionDialogoComponent);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('debe mostrar título, mensaje y los botones Cancelar y Confirmar por defecto', async () => {
    const el = await crear({ titulo: 'Eliminar perfil', mensaje: '¿Seguro?' });
    expect(el.textContent).toContain('Eliminar perfil');
    expect(el.textContent).toContain('¿Seguro?');
    const botones = Array.from(el.querySelectorAll('button')).map((b) => b.textContent!.trim());
    expect(botones).toEqual(['Cancelar', 'Confirmar']);
  });

  it('debe ocultar Cancelar cuando textoCancelar es null y usar el texto personalizado', async () => {
    const el = await crear({ titulo: 'Aviso', mensaje: 'Info', tipo: 'informacion', textoConfirmar: 'Entendido', textoCancelar: null });
    const botones = Array.from(el.querySelectorAll('button')).map((b) => b.textContent!.trim());
    expect(botones).toEqual(['Entendido']);
  });

  it('el tipo "peligro" usa el botón rojo', async () => {
    const el = await crear({ titulo: 'x', mensaje: 'y', tipo: 'peligro' });
    expect(el.querySelector('button.btn-danger')).not.toBeNull();
  });
});