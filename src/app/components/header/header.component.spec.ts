import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  });

  it('should start with the menu closed', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.menuAbierto).toBe(false);
  });

  it('should toggle the menu', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const header = fixture.componentInstance;
    header.alternarMenu();
    expect(header.menuAbierto).toBe(true);
    header.alternarMenu();
    expect(header.menuAbierto).toBe(false);
  });

  it('should show "Iniciar Sesión" when there is no session', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header-actions')?.textContent).toContain('Iniciar Sesión');
  });
});