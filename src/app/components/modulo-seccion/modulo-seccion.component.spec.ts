import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloSeccionComponent } from './modulo-seccion.component';

describe('ModuloSeccionComponent', () => {
  let component: ModuloSeccionComponent;
  let fixture: ComponentFixture<ModuloSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloSeccionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloSeccionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
