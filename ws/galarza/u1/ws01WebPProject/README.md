# HTMLStore-Tu tienda especializada en videojuegos, consolas y tecnología en Ecuador

![Logo principal del proyecto](https://res.cloudinary.com/dyqrc7mxj/image/upload/v1775965883/Gabo_eyckal.png)

## Descripción del proyecto

**HTMLStore** es una plataforma e-commerce desarrollada con bases académicas. Simula una tienda virtual completa orientada a la venta de consolas, accesorios y videojuegos. 

Destacamos su desarrollo al no requerir de backend tradicional que permite una gestión de la lógica de negocio, autenticación, control de inventario y carrito de compras mediante **Vanilla JavaScript** y **Local Storage** del navegador, ofreciendo una experiencia de usuario rápida, fluida y persistente.

## Características principales

- **Carrito de Compras Dinámico:** Cálculo automático de subtotales, impuestos (IVA 15%) y total. Control de cantidades y validación de stock en tiempo real.
- **Autenticación de Usuarios:** Sistema de registro e inicio de sesión.
- **Integración de Hardware:** Uso de API `navigator.mediaDevices` para permitir a usuarios tomar una foto de perfil directamente desde la interfaz de registro.
- **Generación de Facturas PDF:** Integración con librería `jsPDF` para emitir un comprobante descargable automático al finalizar una compra, detallando los datos del usuario y los productos adquiridos.
- **Panel de Administración:** Acceso privilegiado mediante credenciales de administrador con redirección a panel de control exclusivo.
- **Búsqueda Inteligente:** Motor de búsqueda integrado que resalta y desplaza la vista hacia los productos requeridos.
- **Persistencia de Datos:** Uso intensivo de `localStorage` para mantener la sesión activa, el inventario de productos y el historial del carrito entre recargas de la página.

![Publicidad principal generada del proyecto](https://imgs.search.brave.com/c6qLNsldPFIWrklLVuViU2pZCljOFlVyccjSWLUoi4I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vRUFGZDdI/QUJRbTAvMS8wLzE2/MDB3L2NhbnZhLWJh/bm5lci1kZS10d2l0/Y2gtbmUlQzMlQjNu/LWFtYXJpbGxvLXJv/c2EtQWFOSXNJeGNi/RDguanBn)

## Tecnologías utilizadas

* **Estructura y Diseño:** HTML5 semántico y CSS3.
* **Lógica de Negocio:** JavaScript (ES6+), DOM y eventos asíncronos.
* **Librerías Externas:** [jsPDF](https://parall.ax/products/jspdf).
* **Control de Versiones:** Git y GitHub.

## Ejecución

- **Por código**
1. Clonar el repositorio: https://github.com/DiverCesar/Pry_Carrito_Semi.git
2. Abrir `index.html` en el navegador mediante servidor web local.
3. Buscar articulos de videojeugos, agregar al carrito y realizar compra.

- **Por navegador**
1. Acceder a la aplicación web: https://pry-carrito.vercel.app/
2. Ingresar o crear cuenta de usuario personal para persistencia de datos.
3. Buscar articulos de videojeugos, agregar al carrito y realizar compra.

## Licencia

MIT License

Copyright (c) 2025 Calderón Calva Jilmar Jhoel, Galarza Villalva César Luis,
Simbaña Rivadeneira Michael Steven

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
