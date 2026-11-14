import { afterEach } from 'vitest';

// AuthService guarda la sesión y los accesos en sessionStorage, y ese almacenamiento
// se comparte entre los archivos de prueba. Se limpia después de CADA prueba para que
// ninguna deje una sesión abierta que haga fallar a otra
afterEach(() => {
  sessionStorage.clear();
});