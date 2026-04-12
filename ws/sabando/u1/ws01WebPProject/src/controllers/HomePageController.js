import { FetchController } from './FetchController.js';
import { Transaccion } from '../models/Transaccion.js';
import { AppConfig } from '../utils/config.js';
import { Biblioteca } from '../models/Biblioteca.js';
import { NotificationController } from './NotificacionController.js';

export class HomePageController {

    static librosCargados = [];
    static filtroActual = 'todos';

    static async init() {
        console.log("Iniciando Home Page...");
        await this.cargarLibros();
        this.inicializarEventos();
    }

    static asignarEventosInteraccion() {
        // QUERYSELECTORALL: Selecciona todas las tarjetas a la vez
        const tarjetas = document.querySelectorAll('.book-card');

        tarjetas.forEach(tarjeta => {
            // ONMOUSEOVER: Efecto al pasar el mouse
            tarjeta.onmouseover = () => {
                tarjeta.style.transform = "scale(1.05)";
                tarjeta.style.transition = "0.3s";
            };
            
            // ONMOUSEOUT: Restaurar al salir
            tarjeta.onmouseout = () => {
                tarjeta.style.transform = "scale(1)";
            };
        });
    }
    static inicializarEventos() {
        // Evento de búsqueda
        const inputBusqueda = document.getElementById('input-busqueda');
        if (inputBusqueda) {
            inputBusqueda.addEventListener('input', () => {
                this.aplicarFiltros();
            });
        }
    }

    static async cargarLibros() {
        // 1. Traemos los libros de la "BD"
        const libros = await FetchController.getData('libros');
        
        if (libros) {
            this.librosCargados = libros;
            this.aplicarFiltros();
        } else {
            console.error("No se pudieron cargar los libros.");
        }
    }

    static renderizarLibros(listaLibros) {
        const contenedor = document.getElementById('contenedor-libros');
        
        // Limpiamos el contenedor (borramos el ejemplo estático)
        contenedor.innerHTML = '';

        if (listaLibros.length === 0) {
            contenedor.innerHTML = '<div class="col-12"><p class="text-center text-muted">No se encontraron libros</p></div>';
            return;
        }

        // Generamos el HTML para cada libro
        listaLibros.forEach(libro => {
            const tarjetaHTML = this.crearTarjetaHTML(libro);
            contenedor.innerHTML += tarjetaHTML;
        });

        // IMPORTANTE: Asignar eventos a los botones recién creados
        this.asignarEventosDeReserva();
    }

    static aplicarFiltros() {
        // 1. Obtener valor de búsqueda
        const inputBusqueda = document.getElementById('input-busqueda');
        const textoBusqueda = inputBusqueda ? inputBusqueda.value.toLowerCase() : '';

        // 2. Filtrar según búsqueda
        let librosFiltrados = this.librosCargados.filter(libro => 
            libro.titulo.toLowerCase().includes(textoBusqueda) ||
            libro.autor.toLowerCase().includes(textoBusqueda) ||
            libro.genero.toLowerCase().includes(textoBusqueda)
        );

        // 3. Filtrar según vista seleccionada
        librosFiltrados = this.filtrarPorVista(librosFiltrados);

        // 4. Renderizar libros filtrados
        this.renderizarLibros(librosFiltrados);
    }

    static filtrarPorVista(libros) {
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

        switch (this.filtroActual) {
            case 'disponibles':
                return libros.filter(libro => !libro.prestado && !libro.reservado);
            
            case 'mis-libros':
                if (!usuarioLogueado) return [];
                return libros.filter(libro => {
                    // Verificar si el usuario tiene este libro en alguna transacción (préstamo o reserva)
                    return usuarioLogueado.listaTransacciones && 
                        usuarioLogueado.listaTransacciones.some(tx => tx.libro.id === libro.id);
                });
            
            case 'todos':
            default:
                return libros;
        }
    }

    static filtrarVista(vista) {
        this.filtroActual = vista;
        this.aplicarFiltros();
    }

    static crearTarjetaHTML(libro) {
        // Lógica de estado
        let estadoClase, estadoTexto, btnDisabled, btnTexto, btnClase, btnAccion;

        if (!libro.prestado && !libro.reservado) {
            // Disponible para pedir préstamo
            estadoClase = 'badge-disponible bg-success';
            estadoTexto = 'Disponible';
            btnDisabled = '';
            btnTexto = '<i class="bi bi-bag-plus"></i> Pedir Préstamo';
            btnClase = 'btn-primary-custom';
            btnAccion = 'btn-prestamo';
        } else if (libro.prestado && !libro.reservado) {
            // Prestado pero sin reserva
            estadoClase = 'bg-warning';
            estadoTexto = 'Prestado';
            btnDisabled = '';
            btnTexto = '<i class="bi bi-bell"></i> SOLICITAR RESERVA';
            btnClase = 'btn-warning';
            btnAccion = 'btn-reserva';
        } else {
            // No disponible (prestado y reservado)
            estadoClase = 'bg-secondary';
            estadoTexto = 'No disponible';
            btnDisabled = 'disabled';
            btnTexto = 'No disponible';
            btnClase = 'btn-secondary';
            btnAccion = '';
        }

        // Retornamos el String HTML (Template String)
        return `
            <div class="col">
                <div class="card book-card h-100 shadow-sm">
                    <span class="badge badge-status ${estadoClase} position-absolute top-0 end-0 m-2">
                        ${estadoTexto}
                    </span>

                    <div class="book-cover-placeholder d-flex align-items-center justify-content-center bg-light" style="height: 200px;">
                        <i class="bi bi-journal-code display-1 text-secondary"></i>
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-dark text-truncate" title="${libro.titulo}">
                            ${libro.titulo}
                        </h5>
                        <p class="card-text text-muted small mb-1">
                            <i class="bi bi-person"></i> ${libro.autor}
                        </p>
                        <p class="card-text text-muted small">
                            <i class="bi bi-bookmark"></i> ${libro.genero}
                        </p>

                        <div class="mt-auto pt-3">
                            <button class="btn ${btnClase} w-100 shadow-sm ${btnAccion}" 
                                    data-id="${libro.id}" 
                                    ${btnDisabled}>
                                ${btnTexto}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static asignarEventosDeReserva() {
        // Asignar eventos a botones de préstamo
        const botonesPrestamo = document.querySelectorAll('.btn-prestamo');
        botonesPrestamo.forEach(boton => {
            boton.addEventListener('click', async (evento) => {
                const libroId = boton.getAttribute('data-id');
                await this.manejarPrestamo(libroId);
            });
        });

        // Asignar eventos a botones de reserva
        const botonesReserva = document.querySelectorAll('.btn-reserva');
        botonesReserva.forEach(boton => {
            boton.addEventListener('click', async (evento) => {
                const libroId = boton.getAttribute('data-id');
                await this.manejarReserva(libroId);
            });
        });
    }

    static async manejarPrestamo(idLibro) {
        // 1. Verificar sesión
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
        
        if (!usuarioLogueado) {
            await Swal.fire({
                title: 'Sesión requerida',
                text: 'Debes iniciar sesión para realizar un préstamo',
                icon: 'warning',
                confirmButtonText: 'Ir a login'
            });
            window.location.href = 'login.html';
            return;
        }
        // Verificar límite de préstamos
        const prestamosActivos = (usuarioLogueado.listaTransacciones || []).filter(tx => tx.tipo === 1);
        if (prestamosActivos.length >= AppConfig.MAX_LIBROS_PRESTADO) {
            await Swal.fire({
                title: 'Límite de préstamos alcanzado',
                text: `No puedes tener más de ${AppConfig.MAX_LIBROS_PRESTADO} libros prestados.`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // 2. Calcular fechas
        const hoy = new Date();
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + AppConfig.MAX_DIAS_PRESTAMO); 

        try {
            // PASO A: Verificación rápida antes de la espera
            // Es mejor revisar si el libro está disponible ANTES de hacer esperar al usuario
            const libroCheck = await FetchController.getById('libros', idLibro);
            
            if (!libroCheck) {
                throw new Error('El libro no existe o hubo un error al buscarlo.');
            }
            if (libroCheck.prestado) {
                throw new Error('Lo sentimos, este libro ya fue prestado por otra persona.');
            }

            
            Swal.fire({
                title: 'Procesando préstamo...',
                html: 'Verificando disponibilidad y registrando...',
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Detenemos la ejecución 3 segundos
            await new Promise(resolve => setTimeout(resolve, 3000));


            // 3. PRIMERO: Actualizamos el libro en la Base de Datos (PATCH)
            const libroActualizado = await FetchController.patchData('libros', idLibro, { prestado: true });

            if (!libroActualizado) {
                throw new Error('No se pudo actualizar el libro.');
            }

            // 4. SEGUNDO: Creamos la transacción usando el 'libroActualizado'
            const nuevaTransaccion = new Transaccion(
                null,
                libroActualizado, 
                hoy.toISOString(),
                fechaFin.toISOString(),
                { id: usuarioLogueado.id },
                1 // Tipo 1 = Préstamo
            );

            // 5. Guardamos la transacción en la BD (POST)
            const transaccionCreada = await FetchController.postData('transacciones', nuevaTransaccion.toJSON());

            if (!transaccionCreada || !transaccionCreada.id) {
                // ROLLBACK: Si falla, liberamos el libro
                await FetchController.patchData('libros', idLibro, { prestado: false });
                throw new Error('No se pudo registrar la transacción');
            }

            // 6. Actualizamos la lista de transacciones del usuario
            if (!usuarioLogueado.listaTransacciones) {
                usuarioLogueado.listaTransacciones = [];
            }
            usuarioLogueado.listaTransacciones.push(transaccionCreada);

            // Actualizamos usuario en BD
            await FetchController.patchData('usuarios', usuarioLogueado.id, { 
                listaTransacciones: usuarioLogueado.listaTransacciones 
            });

            // Actualizamos usuario en LocalStorage
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));

            // 7. LÓGICA DE NEGOCIO Y NOTIFICACIÓN (Biblioteca + NotificacionController)
            const biblioteca = new Biblioteca();
            if (!usuarioLogueado.notificaciones) usuarioLogueado.notificaciones = [];

            // Usamos la lógica de Biblioteca.js (Case 0: Préstamo)
            const notificacion = biblioteca.notificarCliente(transaccionCreada, 0, usuarioLogueado);

            // Guardamos la notificación en BD
            await FetchController.patchData('usuarios', usuarioLogueado.id, { 
                notificaciones: usuarioLogueado.notificaciones 
            });

            // Mostramos la alerta solicitada
            NotificationController.mostrarConfirmacion(notificacion.mensaje);

            await this.cargarLibros();

        } catch (error) {
            console.error("Error al procesar el préstamo:", error);
            await Swal.fire({
                title: 'Error',
                text: error.message || 'Ocurrió un error al procesar el préstamo.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    }


    static async manejarReserva(idLibro) {
        // 1. Verificar sesión
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
        
        if (!usuarioLogueado) {
            await Swal.fire({
                title: 'Sesión requerida',
                text: 'Debes iniciar sesión para reservar',
                icon: 'warning',
                confirmButtonText: 'Ir a login'
            });
            window.location.href = 'login.html'; 
            return;
        }
        // Verificar límite de reservas
        const reservasActivas = (usuarioLogueado.listaTransacciones || []).filter(tx => tx.tipo === 0);
        if (reservasActivas.length >= AppConfig.MAX_LIBROS_RESERVADO) {
            await Swal.fire({
                title: 'Límite de reservas alcanzado',
                text: `No puedes tener más de ${AppConfig.MAX_LIBROS_RESERVADO} libros reservados.`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        try {
            // PASO A: Validaciones PREVIAS (Rápidas, sin espera)
            const libroExistente = await FetchController.getById('libros', idLibro);
            
            if (!libroExistente) {
                throw new Error('El libro no existe.');
            }

            const listaRevisar = usuarioLogueado.listaTransacciones || []; 
            const yaLoTienePrestado = listaRevisar.some(tx => 
                tx.libro.id === idLibro && tx.tipo === 1 
            );

            if (yaLoTienePrestado) {
                await Swal.fire({
                    title: 'Acción no permitida',
                    text: 'No puedes reservar un libro que ya tienes prestado.',
                    icon: 'warning'
                });
                return; 
            }

            if (libroExistente.reservado) {
                throw new Error('Este libro ya ha sido reservado por otro usuario.');
            }

            // -----------------------------------------------------------------
            // ⏳ INICIO DE LA SIMULACIÓN DE ESPERA
            // -----------------------------------------------------------------
            
            // 1. Mostramos alerta de carga para que el usuario sepa qué pasa
            Swal.fire({
                title: 'Procesando reserva...',
                html: 'Por favor espera un momento.',
                timer: 3000, // Opcional: sincronizado con el timeout
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 2. EL SET TIMEOUT (Truco: Envolverlo en Promise para usar 'await')
            // Esto detiene el código aquí por 3000ms (3 segundos)
            await new Promise(resolve => setTimeout(resolve, 3000));

            // -----------------------------------------------------------------
            // 🚀 FIN DE LA ESPERA - EJECUCIÓN REAL
            // -----------------------------------------------------------------

            // 2. PRIMERO: Reservamos el libro en la BD
            const libroActualizado = await FetchController.patchData('libros', idLibro, { reservado: true });
                
            if (!libroActualizado) {
                throw new Error('No se pudo conectar con la base de datos.');
            }

            // 3. SEGUNDO: Creamos la transacción
            const nuevaReserva = new Transaccion(
                null,
                libroActualizado, 
                new Date().toISOString(),
                null,
                { id: usuarioLogueado.id },
                0 
            );

            // 4. Guardamos la transacción
            const reservaCreada = await FetchController.postData('transacciones', nuevaReserva);
            
            if (!reservaCreada || !reservaCreada.id) {
                await FetchController.patchData('libros', idLibro, { reservado: false });
                throw new Error('Falló al guardar la transacción');
            }

            // 5. Actualizar usuario
            if (!usuarioLogueado.listaTransacciones) {
                usuarioLogueado.listaTransacciones = [];
            }
            usuarioLogueado.listaTransacciones.push(reservaCreada); 

            await FetchController.patchData('usuarios', usuarioLogueado.id, { 
                listaTransacciones: usuarioLogueado.listaTransacciones 
            });

            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));

            // 6. LÓGICA DE NEGOCIO Y NOTIFICACIÓN (Biblioteca + NotificacionController)
            const biblioteca = new Biblioteca();
            if (!usuarioLogueado.notificaciones) usuarioLogueado.notificaciones = [];

            // Usamos la lógica de Biblioteca.js (Case 1: Reserva)
            const notificacion = biblioteca.notificarCliente(reservaCreada, 1, usuarioLogueado);

            // Guardamos la notificación en BD
            await FetchController.patchData('usuarios', usuarioLogueado.id, { 
                notificaciones: usuarioLogueado.notificaciones 
            });

            // Mostramos la alerta solicitada
            NotificationController.mostrarConfirmacion(notificacion.mensaje);

            await this.cargarLibros(); 

        } catch (error) {
            console.error("Error reserva:", error);
            await Swal.fire({
                title: 'Error',
                text: error.message || 'No se pudo completar la reserva.',
                icon: 'error'
            });
        }
    }
}


// Hacer filtrarVista accesible desde el HTML (onclick handler)
window.filtrarVista = (vista) => {
    HomePageController.filtrarVista(vista);
};