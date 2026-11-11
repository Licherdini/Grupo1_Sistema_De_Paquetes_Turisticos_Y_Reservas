# Grupo1_Sistema_De_Paquetes_Turisticos_Y_Reservas

Proyecto de la asignatura **Desarrollo de Aplicaciones Web Avanzado (DAWA)** — Universidad de Guayaquil.
Docente: Ph.D. Jorge Luis Charco Aguirre.

## Descripción
**AndesTravel UG**: Single Page Application para la comercialización de paquetes turísticos, cotizaciones y reservas multidestino

## Integrantes y módulos
| Módulo | Integrante |
|:--:|:--|
| 1. Seguridad, Autenticación y Perfiles | Jhon Herrera Merchán |
| 2. Catálogo de Paquetes y Destinos | Angie Lopez Mena |
| 3. Proveedores, Hoteles y Transporte | Sebastián Acosta Andrade |
| 4. Cotizaciones y Reservas | Kenny Ormaza Padilla |
| 5. Facturación, Pagos y Reseñas | Danny Guaman Yucailla |

## Tecnologías
Angular 22 (componentes Standalone), TypeScript, Bootstrap 5.3 (CDN), CSS, Vitest.

## Requisitos previos
- Node.js **22.22.3 o superior** (también compatible 24.15.0+), según los `engines` de Angular 22.
- Angular CLI: `npm install -g @angular/cli`

## Instalación y ejecución
```bash
npm install
ng serve
```
Abrir `http://localhost:4200/`.

## Credenciales de prueba (validación interna en `AuthService`)
- Usuario: `admin`
- Clave: `12345`

## Rutas
- `/login`: acceso (componente embebido, sin modales).
- `/principal`: panel y bosquejo de los 5 módulos (protegido por guardia de ruta).

## Comandos útiles
```bash
ng build              # compilación de producción en dist/
ng test --no-watch    # pruebas unitarias con Vitest
```

## Arquitectura y Componentes de Angular (AndesTravel UG)

* **Componentes Independientes (Standalone):**
  * `HeaderComponent` (`src/app/components/header/`): Barra de navegación superior responsiva que consume el estado reactivo de la sesión y los datos institucionales.
  * `FooterComponent` (`src/app/components/footer/`): Pie de página con información de copyright e integrantes del Grupo 1.
  * `LoginComponent` (`src/app/components/login/`): Formulario central de autenticación (sin modales) que implementa *Two-Way Binding* `[(ngModel)]`, *Property Binding* `[type]` y *Event Binding* `(click)` / `(keyup.enter)`.
  * `PrincipalComponent` (`src/app/components/principal/`): Panel principal con el bosquejo funcional de los 5 módulos del sistema turístico.
* **Servicios Globales (`@Injectable`) y Reactividad con Signals:**
  * `AuthService` (`src/app/services/auth.service.ts`): Gestiona las credenciales de acceso y el estado reactivo mediante **Angular Signals** (`estaLogueado` y `usuarioActual`), separando la verificación (`credencialesValidas()`) de la mutación de estado (`iniciarSesion()` y `cerrarSesion()`).
  * `ProyectoInfoService` (`src/app/services/proyecto-info.service.ts`): Centraliza los metadatos de la empresa (*AndesTravel UG*), subtítulo, año e integrantes para evitar duplicación en cabecera y pie de página.
* **Seguridad de Rutas (Route Guards):**
  * `authGuard` (`src/app/guards/auth.guard.ts`): Protege la ruta `/principal` verificando `authService.estaLogueado()` y redirigiendo a `/login` si no existe una sesión activa en memoria.