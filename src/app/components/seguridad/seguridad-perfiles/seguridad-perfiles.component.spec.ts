import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadPerfilesComponent } from './seguridad-perfiles.component';

describe('SeguridadPerfilesComponent', () => {
  let component: SeguridadPerfilesComponent;
  let fixture: ComponentFixture<SeguridadPerfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadPerfilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadPerfilesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
