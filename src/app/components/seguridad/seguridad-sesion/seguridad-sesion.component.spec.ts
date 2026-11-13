import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadSesionComponent } from './seguridad-sesion.component';

describe('SeguridadSesionComponent', () => {
  let component: SeguridadSesionComponent;
  let fixture: ComponentFixture<SeguridadSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadSesionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadSesionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
