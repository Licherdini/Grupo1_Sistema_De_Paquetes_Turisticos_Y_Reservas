import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadPerfilDetalleComponent } from './seguridad-perfil-detalle.component';

describe('SeguridadPerfilDetalleComponent', () => {
  let component: SeguridadPerfilDetalleComponent;
  let fixture: ComponentFixture<SeguridadPerfilDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadPerfilDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadPerfilDetalleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
