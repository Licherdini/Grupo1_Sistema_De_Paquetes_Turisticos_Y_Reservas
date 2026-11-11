import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  });

  it('debería iniciar con el menú cerrado', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.menuAbierto).toBe(false);
  });

  it('debería alternar la apertura y cierre del menú', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const header = fixture.componentInstance;
    header.alternarMenu();
    expect(header.menuAbierto).toBe(true);
    header.alternarMenu();
    expect(header.menuAbierto).toBe(false);
  });

  it('debería mostrar "Iniciar Sesión" cuando no hay sesión activa', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header-actions')?.textContent).toContain('Iniciar Sesión');
  });

  it('debería mostrar el usuario en mayúsculas y el botón "Cerrar Sesión" tras iniciarSesion()', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const authService = TestBed.inject(AuthService);

    authService.iniciarSesion('jhon');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const actionsText = compiled.querySelector('.header-actions')?.textContent;
    expect(actionsText).toContain('JHON');
    expect(actionsText).toContain('Cerrar Sesión');
  });
});