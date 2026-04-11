# PRY_DIGITAL_LIBRARY

Proyecto final de desarrollo de aplicaciones web interactivas usando HTML, CSS y JavaScript. La biblioteca digital permite buscar, filtrar, reservar y devolver libros, con notificaciones y recordatorios.

## Objetivo del proyecto
Demostrar el analisis y aplicacion de conceptos fundamentales de programacion web en JavaScript para resolver un caso practico de gestion de prestamos y devoluciones.

## Funcionalidades principales
- Busqueda por titulo, autor o categoria.
- Filtros dinamicos por categoria.
- Reservas con seleccion de dias de prestamo.
- Devolucion de libros con actualizacion de disponibilidad.
- Notificaciones con toasts de Bootstrap.
- Recordatorios periodicos de vencimientos.

## Tecnologias
- HTML5
- CSS3
- JavaScript 
- Bootstrap 5

## Estructura del proyecto
- index.html
- public/css/styles.css
- public/js/cargar_elementos.js
- public/js/filtrar_buscar.js
- public/js/limpiar_campos.js
- public/js/reservar_libros.js
- public/js/alertas.js

## Analisis y justificacion (criterios de evaluacion)

### 1) Uso de arrays y metodos funcionales
- `push` y `splice` para registrar y eliminar reservas.
- `find` y `some` para validar disponibilidad y reservas activas.
- `filter` para busquedas y filtros dinamicos.
- `forEach` para renderizar tablas.

### 2) Filtrado y busqueda dinamica
- Filtros por texto y categoria en [public/js/filtrar_buscar.js](public/js/filtrar_buscar.js).
- Debounce con `setTimeout` para simular busqueda con latencia.

### 3) DOM y eventos
- Manipulacion DOM con `getElementById` y `querySelectorAll`.
- Eventos `click`, `input`, `change` en busqueda, filtros y reservas.

### 4) Objetos y clases
- Clase `Reserva` para estructura consistente de reservas en [public/js/reservar_libros.js](public/js/reservar_libros.js).

### 5) Funciones y asincronia
- `async/await` y Promesas para simular verificacion de disponibilidad.
- `setTimeout` para latencia simulada y `setInterval` para recordatorios en [public/js/alertas.js](public/js/alertas.js).

### 6) Notificaciones (reto del caso practico)
- Confirmaciones de reserva y devolucion con toasts.
- Recordatorios de vencimientos periodicos.

## Como ejecutar
1. Abrir `index.html` en el navegador.
2. Buscar libros, filtrar y realizar reservas.

## Enlaces
- Repositorio: https://github.com/ProgramacionWeb27811/PRY_DIGITAL_LIBRARY.git
- Deployment: https://programacionweb27811.github.io/PRY_DIGITAL_LIBRARY/

