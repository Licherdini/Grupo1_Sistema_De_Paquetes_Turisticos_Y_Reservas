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