var ProductosLibreria = (function () {
    // Si ya existe, retornar la instancia existente (Singleton)
    if (window.ProductosLibreria) {
        console.log('ProductosLibreria ya existe, reutilizando instancia');
        return window.ProductosLibreria;
    }

    // Variables privadas
    var librosActuales = [];
    var libroSeleccionado = null;

    var elementos = {
        container: null,
        modal: null,
        loadingSpinner: null,
        buscarInput: null,
        filtroGenero: null
    };

    function init() {
        console.log('Inicializando ProductosLibreria...');

        // Obtener referencias a los elementos del DOM
        elementos.container = document.getElementById('libros-container');
        elementos.modal = document.getElementById('modal-libro');
        elementos.loadingSpinner = document.getElementById('loading-spinner');
        elementos.buscarInput = document.getElementById('buscar-libro');
        elementos.filtroGenero = document.getElementById('filtro-genero');

        console.log('Elementos del DOM encontrados:', {
            container: !!elementos.container,
            modal: !!elementos.modal,
            spinner: !!elementos.loadingSpinner
        });

        if (!elementos.container) {
            console.error('No se encontro el contenedor de libros');
            return;
        }

        cargarLibros();
        configurarEventListeners();
    }

    function cargarLibros() {
        console.log('Cargando libros...');
        console.log('Biblioteca disponible:', !!window.Biblioteca);

        // Simular carga (en un caso real sería una llamada a API)
        setTimeout(() => {
            if (window.Biblioteca && window.Biblioteca.libros) {
                librosActuales = [...window.Biblioteca.libros];
                console.log('Libros cargados:', librosActuales.length);

                renderizarLibros(librosActuales);

                if (elementos.loadingSpinner) {
                    elementos.loadingSpinner.style.display = 'none';
                }
            } else {
                console.error('No se encontraron datos en Biblioteca');
                console.log('Objeto Biblioteca:', window.Biblioteca);
                mostrarError();
            }
        }, 500);
    }

    function configurarEventListeners() {
        // Búsqueda por texto
        if (elementos.buscarInput) {
            elementos.buscarInput.addEventListener('input', () => {
                filtrarLibros();
            });
        }

        // Filtrado por género
        if (elementos.filtroGenero) {
            elementos.filtroGenero.addEventListener('change', () => {
                filtrarLibros();
            });
        }

        // Cerrar modal
        const btnCerrar = document.getElementById('cerrar-modal');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => cerrarModal());
        }

        // Cerrar modal al hacer click fuera
        if (elementos.modal) {
            elementos.modal.addEventListener('click', (e) => {
                if (e.target === elementos.modal) {
                    cerrarModal();
                }
            });
        }

        // Botones de acción del modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btn-prestar') {
                solicitarPrestamo();
            } else if (e.target.id === 'btn-devolver') {
                registrarDevolucion();
            }
        });
    }

    function filtrarLibros() {
        const busqueda = elementos.buscarInput.value.toLowerCase();
        const generoFiltro = elementos.filtroGenero.value;

        const librosFiltrrados = librosActuales.filter(libro => {
            const coincideBusqueda =
                libro.titulo.toLowerCase().includes(busqueda) ||
                libro.autor.toLowerCase().includes(busqueda);

            const coincideGenero = !generoFiltro || libro.genero === generoFiltro;

            return coincideBusqueda && coincideGenero;
        });

        renderizarLibros(librosFiltrrados);
    }

    function renderizarLibros(libros) {
        console.log('Renderizando libros:', libros.length);

        if (libros.length === 0) {
            elementos.container.innerHTML = `
                <div class="sin-resultados">
                    <p>No se encontraron libros</p>
                </div>
            `;
            return;
        }

        const html = libros.map(libro => crearTarjetaLibro(libro)).join('');
        console.log('HTML generado, longitud:', html.length);

        elementos.container.innerHTML = html;

        // Agregar event listeners a las tarjetas
        document.querySelectorAll('.tarjeta-libro').forEach(tarjeta => {
            tarjeta.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-accion')) return;
                const libroId = parseInt(tarjeta.dataset.id);
                abrirModal(libroId);
            });
        });

        console.log('Tarjetas renderizadas:', libros.length);
    }

    function crearTarjetaLibro(libro) {
        const claseBadge = libro.disponible ? 'badge-disponible' : 'badge-prestado';
        const textoDisponibilidad = libro.disponible ? 'Disponible' : 'Prestado';

        return `
            <div class="tarjeta-libro" data-id="${libro.id}">
                <div class="tarjeta-portada">
                    <img src="${libro.portada}" alt="${libro.titulo}">
                    <div class="tarjeta-overlay">
                        <button class="btn btn-sm btn-accion btn-ver-detalles">Ver Detalles</button>
                    </div>
                </div>
                <div class="tarjeta-info">
                    <h3 class="tarjeta-titulo">${libro.titulo}</h3>
                    <p class="tarjeta-autor">${libro.autor}</p>
                    <p class="tarjeta-genero">${libro.genero}</p>
                    <span class="badge ${claseBadge}">${textoDisponibilidad}</span>
                </div>
            </div>
        `;
    }

    function abrirModal(libroId) {
        const libro = window.Biblioteca.libros.find(l => l.id === libroId);
        if (!libro) return;

        libroSeleccionado = libro;

        // Llenar el modal con la información del libro
        document.getElementById('modal-imagen').src = libro.portada;
        document.getElementById('modal-titulo').textContent = libro.titulo;
        document.getElementById('modal-autor').textContent = `Autor: ${libro.autor}`;
        document.getElementById('modal-genero').textContent = `Género: ${libro.genero}`;

        // Configurar disponibilidad
        const badgeDisponibilidad = document.getElementById('modal-disponibilidad');
        const btnPrestar = document.getElementById('btn-prestar');
        const btnDevolver = document.getElementById('btn-devolver');

        if (libro.disponible) {
            badgeDisponibilidad.textContent = 'Disponible';
            badgeDisponibilidad.className = 'badge badge-disponible';
            btnPrestar.style.display = 'inline-block';
            btnDevolver.style.display = 'none';
            // NotificationServices.mostrarNotificacionDevolucion(libro);
        } else {
            badgeDisponibilidad.textContent = 'Prestado';
            badgeDisponibilidad.className = 'badge badge-prestado';
            btnPrestar.style.display = 'none';
            btnDevolver.style.display = 'inline-block';
            // NotificationServices.mostrarNotificacionPrestamo(libro);
        }

        // Mostrar el modal
        elementos.modal.classList.add('activo');
    }

    function cerrarModal() {
        elementos.modal.classList.remove('activo');
        libroSeleccionado = null;
    }

    function solicitarPrestamo() {
        if (!libroSeleccionado) return;

        const libro = window.Biblioteca.toggleDisponibilidad(libroSeleccionado.id);

        if (libro) {
            mostrarNotificacion('Préstamo solicitado exitosamente', 'success');
            NotificationService.mostrarNotificacionPrestamo(libro);
            // Actualizar el modal
            setTimeout(() => {
                abrirModal(libro.id);
                cargarLibros(); // Recargar la lista
            }, 500);
        }
    }

    function registrarDevolucion() {
        if (!libroSeleccionado) return;

        const libro = window.Biblioteca.toggleDisponibilidad(libroSeleccionado.id);

        if (libro) {
            mostrarNotificacion('Devolución registrada exitosamente', 'success');
            NotificationService.mostrarNotificacionDevolucion(libro);

            // Actualizar el modal
            setTimeout(() => {
                abrirModal(libro.id);
                cargarLibros(); // Recargar la lista
            }, 500);
        }
    }

    function mostrarNotificacion(mensaje, tipo) {
        // Si existe NotificationService, usarlo
        if (window.NotificationService) {
            window.NotificationService.mostrarNotificacion(mensaje, tipo);
        } else {
            // Fallback: usar mostrarAlerta de swetalert.js
            mostrarAlerta(mensaje, tipo);
        }
    }

    function mostrarError() {
        elementos.container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error al cargar los libros. Por favor, intenta más tarde.
            </div>
        `;
    }

    // API pública
    return {
        init: init
    };
})();
