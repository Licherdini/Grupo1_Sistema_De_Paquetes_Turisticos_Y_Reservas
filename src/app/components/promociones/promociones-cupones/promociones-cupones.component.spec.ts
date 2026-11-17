import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { PromocionesCuponesComponent } from './promociones-cupones.component';
import { PromocionesService } from '../../../services/promociones.service';

describe('PromocionesCuponesComponent', () => {
  const dialogMock = {
    open: () => ({
      afterClosed: () => of(null)
    })
  };

  const snackBarMock = {
    open: () => {}
  };

  function crear(codigo?: string) {
    TestBed.configureTestingModule({
      imports: [PromocionesCuponesComponent],
      providers: [
        provideRouter([]),
        PromocionesService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(codigo ? { codigo } : {}) } },
        },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ],
    });
    return TestBed.createComponent(PromocionesCuponesComponent);
  }

  it('debe precargar el buscador con el código recibido en la URL', () => {
    const cupones = crear('ANDES15').componentInstance;
    expect(cupones.textoBusqueda).toBe('ANDES15');
    expect(cupones.cuponesFiltrados().length).toBe(1);
  });

  it('debe tratar como expirado un cupón sin usos disponibles', () => {
    const cupones = crear().componentInstance;
    const agotado = cupones.cupones.find((c) => c.codigo === 'SELVA12')!;
    expect(cupones.estadoEfectivo(agotado)).toBe('Expirado');
  });

  it('debe filtrar por estado y por texto', () => {
    const cupones = crear().componentInstance;
    cupones.estadoFiltro = 'Expirado';
    expect(cupones.cuponesFiltrados().length).toBe(2);
    cupones.estadoFiltro = 'Todos';
    cupones.textoBusqueda = 'no-existe';
    expect(cupones.cuponesFiltrados().length).toBe(0);
    cupones.limpiarFiltros();
    expect(cupones.cuponesFiltrados().length).toBe(cupones.cupones.length);
  });

  it('debe mostrar el mensaje de tabla vacía cuando nada coincide', async () => {
    const fixture = crear();
    fixture.componentInstance.textoBusqueda = 'zzz';
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No hay cupones que coincidan');
  });

  it('debe crear un cupón validando rango de descuento y código duplicado', () => {
    const cupones = crear().componentInstance;
    cupones.borrador = { codigo: 'andes15', campana: 'Otra campaña', descuento: 10, usosTotales: 5, estado: 'Vigente' };
    expect(cupones.codigoDuplicado()).toBe(true);
    cupones.borrador = { codigo: 'nuevo30', campana: 'Campaña nueva', descuento: 80, usosTotales: 5, estado: 'Vigente' };
    expect(cupones.formularioValido()).toBe(false);
    cupones.borrador.descuento = 30;
    expect(cupones.formularioValido()).toBe(true);
    const antes = cupones.cupones.length;
    cupones.guardar();
    expect(cupones.cupones.length).toBe(antes + 1);
    expect(cupones.cupones[0].codigo).toBe('NUEVO30');
    expect(cupones.cupones[0].usosDisponibles).toBe(5);
  });

  it('debe editar un cupón y ajustar los usos disponibles por la diferencia del límite', () => {
    const cupones = crear().componentInstance;
    const cupon = cupones.cupones[0]; // 18 de 50
    cupones.editandoId = cupon.id;
    cupones.borrador = {
      codigo: cupon.codigo,
      campana: cupon.campana,
      descuento: cupon.descuento,
      usosTotales: 60,
      estado: cupon.estado
    };
    cupones.guardar();
    const actualizado = cupones.cupones.find((c) => c.id === cupon.id)!;
    expect(actualizado.usosTotales).toBe(60);
    expect(actualizado.usosDisponibles).toBe(28);
    expect(cupones.editandoId).toBeNull();
  });

  it('debe alternar el estado, salvo que no queden usos', () => {
    const cupones = crear().componentInstance;
    const vigente = cupones.cupones[0];
    cupones.alternarEstado(vigente);
    const modificado = cupones.cupones.find((c) => c.id === vigente.id)!;
    expect(modificado.estado).toBe('Expirado');
    const agotado = cupones.cupones.find((c) => c.codigo === 'SELVA12')!;
    cupones.alternarEstado(agotado);
    expect(agotado.estado).toBe('Vigente');
    expect(cupones.estadoEfectivo(agotado)).toBe('Expirado');
  });

  it('debe aplicar solo cupones vigentes y quitar el aviso al eliminarlo', async () => {
    const fixture = crear();
    const cupones = fixture.componentInstance;
    const expirado = cupones.cupones.find((c) => c.codigo === 'NAVIDAD25')!;
    cupones.aplicarEnCotizador(expirado);
    expect(cupones.cuponAplicado).toBeNull();
    const vigente = cupones.cupones[0];
    cupones.aplicarEnCotizador(vigente);
    expect(cupones.cuponAplicado?.codigo).toBe('UGVIAJA20');
    
    // Simular confirmación en diálogo de eliminación
    const dialog = TestBed.inject(MatDialog);
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);

    await cupones.eliminar(vigente);
    expect(cupones.cuponAplicado).toBeNull();
    expect(cupones.cupones.some((c) => c.id === vigente.id)).toBe(false);
  });

  it('debe deshabilitar "Usar" en cupones expirados', async () => {
    const fixture = crear();
    await fixture.whenStable();
    fixture.detectChanges();
    const botones = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button.btn-primary')
    ) as HTMLButtonElement[];
    // Filas: UGVIAJA20, ANDES15, SPONDY10 (vigentes), SELVA12 y NAVIDAD25 (expirados)
    expect(botones[0].disabled).toBe(false);
    expect(botones[3].disabled).toBe(true);
    expect(botones[4].disabled).toBe(true);
  });
});
