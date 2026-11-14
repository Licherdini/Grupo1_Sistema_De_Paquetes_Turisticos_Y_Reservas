import { routes } from './app.routes';
import { ModuloLayoutComponent } from './components/modulo-layout/modulo-layout.component';
import { authGuard } from './guards/auth.guard';

describe('Rutas de la aplicación', () => {
  const rutasDeModulo = routes.filter((ruta) => ruta.component === ModuloLayoutComponent);

  it('debe haber una ruta por cada uno de los 5 módulos', () => {
    expect(rutasDeModulo.map((r) => r.data?.['moduloId']).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('todas las rutas de módulo deben estar protegidas con authGuard', () => {
    rutasDeModulo.forEach((ruta) => expect(ruta.canActivate).toContain(authGuard));
  });

  it('cada módulo debe tener al menos una ruta hija', () => {
    rutasDeModulo.forEach((ruta) => expect((ruta.children ?? []).length).toBeGreaterThan(0));
  });

  it('en Seguridad, perfiles/nuevo debe declararse antes de perfiles/:usuario', () => {
    const seguridad = rutasDeModulo.find((ruta) => ruta.data?.['moduloId'] === 1);
    const rutas = (seguridad?.children ?? []).map((hija) => hija.path);
    expect(rutas).toContain('perfiles/:usuario/editar');
    expect(rutas.indexOf('perfiles/nuevo')).toBeGreaterThan(-1);
    expect(rutas.indexOf('perfiles/nuevo')).toBeLessThan(rutas.indexOf('perfiles/:usuario'));
  });
});