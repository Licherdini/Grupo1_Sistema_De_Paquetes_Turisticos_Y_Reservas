import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadAccesosComponent } from './seguridad-accesos.component';

describe('SeguridadAccesosComponent', () => {
  let component: SeguridadAccesosComponent;
  let fixture: ComponentFixture<SeguridadAccesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadAccesosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadAccesosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
