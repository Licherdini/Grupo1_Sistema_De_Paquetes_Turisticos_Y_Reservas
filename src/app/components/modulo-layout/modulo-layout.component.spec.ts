import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloLayoutComponent } from './modulo-layout.component';

describe('ModuloLayoutComponent', () => {
  let component: ModuloLayoutComponent;
  let fixture: ComponentFixture<ModuloLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
