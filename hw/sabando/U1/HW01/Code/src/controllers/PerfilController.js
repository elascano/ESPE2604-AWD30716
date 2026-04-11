import { FetchController } from '../controllers/FetchController.js';
import { Biblioteca } from '../models/Biblioteca.js';

export class PerfilController {

    constructor() {
        this.dataTable = null; // Para guardar la instancia de DataTables
        this.filaEnEdicion = null; // Para guardar la fila en edición
    }

    async init() {
        // 1. Verificación de Sesión
        const usuarioSesion = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (!usuarioSesion) {
            window.location.href = 'login.html';
            return;
        }

        // 2. Renderizar Sidebar (Texto del tipo de usuario)
        this.#renderizarSidebar(usuarioSesion);

        // 3. Lógica según el Rol (0: Admin, 1: Cliente)
        if (usuarioSesion.tipo === 0) {
            await this.#iniciarVistaAdmin();
        } else {
            await this.#iniciarVistaAlumno(usuarioSesion);
        }

        // Listener logout
        const btnLogout = document.querySelector('.btn-outline-danger');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.removeItem('usuarioLogueado');
                window.location.href = 'login.html';
            });
        }

        //verificacion usuario logeado
        console.log('Usuario en sesión:', usuarioSesion);
    }

    #renderizarSidebar(usuario) {
        // Validamos que los elementos existan antes de escribir
        const elNombre = document.getElementById('perfil-nombre');
        const elEmail = document.getElementById('perfil-email');
        const elRol = document.getElementById('perfil-rol');

        if (elNombre) elNombre.innerText = usuario.nombre;
        if (elEmail) elEmail.innerText = usuario.email;

        // Aquí corregimos para que aparezca "Administrador"
        if (elRol) {
            elRol.innerText = (usuario.tipo === 0) ? 'Administrador' : 'Estudiante';

            // Opcional: Cambiar color si es admin
            if (usuario.tipo === 0) {
                elRol.classList.remove('text-primary');
                elRol.classList.add('text-danger');
            }
        }
    }

    // =========================================================
    //  LÓGICA DEL ALUMNO (1) - ¡ACTUALIZADA A NUEVA ESTRUCTURA!
    // =========================================================
    async #iniciarVistaAlumno(usuario) {
        const divUsuario = document.getElementById('vista_usuario');
        if(divUsuario) divUsuario.classList.remove('d-none');

        const btnCatalogo = document.getElementById('btn_catalogo');
        if(btnCatalogo) btnCatalogo.classList.remove('d-none');

        // AHORA: Traemos 'transacciones' filtrando por el ID del cliente
        // Esto traerá tanto Préstamos (1) como Reservas (0)
        const transacciones = await FetchController.getData('transacciones', { 'clienteResumen.id': usuario.id });
        
        const tbody = document.getElementById('body-prestamos-alumno');
        if (!tbody) {
            console.error("ERROR CRÍTICO: No encuentro id='body-prestamos-alumno'");
            return;
        }

        let htmlFilas = '';
        let librosEnPosesion = 0;

        if (transacciones && transacciones.length > 0) {
            transacciones.forEach(tx => {
                // TIPO 1: PRÉSTAMO
                if (tx.tipo === 1) { 
                    librosEnPosesion++;
                    htmlFilas += this.#crearFilaTransaccionHTML(tx, 'prestamo');
                } 
                // TIPO 0: RESERVA (¡Nuevo!)
                else if (tx.tipo === 0) {
                    htmlFilas += this.#crearFilaTransaccionHTML(tx, 'reserva');
                }
            });
        }
        
        // Actualizar contador
        const contador = document.getElementById('perfil-contador');
        if(contador) contador.innerText = librosEnPosesion;

        tbody.innerHTML = htmlFilas;
        this.#iniciarDataTable('#tablaPrestamosAlumno');

        // Asignar eventos: Botón DEVOLVER (Préstamos)
        this.#asignarEventosBotones('.btn-devolver', (id) => this.#procesarDevolucion(id));
        
        // Asignar eventos: Botón CANCELAR (Reservas)
        this.#asignarEventosBotones('.btn-cancelar', (id) => this.#procesarCancelacionReserva(id));
    }

    #crearFilaPrestamoHTML(tx) {
        const fechaFin = new Date(tx.fechaFin);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
        
        let badgeClase = 'bg-success';
        let badgeTexto = 'A tiempo';
        let fechaClase = 'text-success';

        if (diasRestantes < 0) {
            badgeClase = 'bg-danger';
            badgeTexto = 'Vencido';
            fechaClase = 'text-danger fw-bold';
        } else if (diasRestantes <= 2) {
            badgeClase = 'bg-warning text-dark';
            badgeTexto = 'Por vencer';
            fechaClase = 'text-warning fw-bold';
        }

        return `
            <tr>
                <td class="fw-bold text-dark ps-3">
                    <i class="bi bi-book text-primary me-2"></i> ${tx.libro.titulo}
                </td>
                <td class="text-muted small">${new Date(tx.fechaInicio).toLocaleDateString()}</td>
                <td class="${fechaClase} small">${new Date(tx.fechaFin).toLocaleDateString()}</td>
                <td><span class="badge ${badgeClase}">${badgeTexto}</span></td>
                <td class="text-end pe-3">
                    <button class="btn btn-sm btn-outline-primary rounded-pill btn-devolver" 
                        data-id="${tx.id}" data-libro="${tx.libro.id}">
                        Devolver
                    </button>
                </td>
            </tr>
        `;
    }

    #crearFilaTransaccionHTML(tx, tipo) {
        let fechaFinTexto = '';
        let badgeHTML = '';
        let botonHTML = '';
        let fechaClase = '';

        if (tipo === 'prestamo') {
            // Lógica de Semáforo para Préstamos
            const fechaFin = new Date(tx.fechaFin);
            const hoy = new Date();
            const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
            
            if (diasRestantes < 0) {
                badgeHTML = '<span class="badge bg-danger">Vencido</span>';
                fechaClase = 'text-danger fw-bold';
            } else if (diasRestantes <= 2) {
                badgeHTML = '<span class="badge bg-warning text-dark">Por vencer</span>';
                fechaClase = 'text-warning fw-bold';
            } else {
                badgeHTML = '<span class="badge bg-success">A tiempo</span>';
                fechaClase = 'text-success';
            }
            
            fechaFinTexto = fechaFin.toLocaleDateString();
            botonHTML = `<button class="btn btn-sm btn-outline-primary rounded-pill btn-devolver" 
                            data-id="${tx.id}">Devolver</button>`;
        } 
        else if (tipo === 'reserva') {
            // Lógica para Reservas
            fechaFinTexto = '---'; // No tiene fecha fin fija aún
            badgeHTML = '<span class="badge bg-info text-dark">Reservado</span>';
            fechaClase = 'text-muted';
            botonHTML = `<button class="btn btn-sm btn-outline-secondary rounded-pill btn-cancelar" 
                            data-id="${tx.id}">Cancelar</button>`;
        }

        return `
            <tr>
                <td class="fw-bold text-dark ps-3">
                    <i class="bi bi-book text-primary me-2"></i> ${tx.libro.titulo}
                </td>
                <td class="text-muted small">${new Date(tx.fechaInicio).toLocaleDateString()}</td>
                <td class="${fechaClase} small">${fechaFinTexto}</td>
                <td>${badgeHTML}</td>
                <td class="text-end pe-3">
                    ${botonHTML}
                </td>
            </tr>
        `;
    }

    //funcion completa v1
    async #procesarDevolucion(transaccionId) {
        const result = await Swal.fire({
            title: '¿Devolver libro?',
            text: "Se procesará la devolución del ejemplar.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, devolver',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // 1. Obtener la transacción a eliminar para sacar el ID del libro
                let txActual = await FetchController.getById('transacciones', transaccionId);
                const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogueado'));

                // Fallback si no está en server global
                if (!txActual && usuarioLocal) {
                    txActual = usuarioLocal.listaTransacciones.find(t => String(t.id) === String(transaccionId));
                }

                if (!txActual) throw new Error("Transacción no encontrada.");

                const libroId = txActual.libro ? txActual.libro.id : txActual.libroId;

                // 2. ELIMINAR EL PRÉSTAMO ACTUAL (El tuyo)
                try {
                    await FetchController.deleteData('transacciones', transaccionId);
                } catch (e) { console.warn("Ya borrado del servidor global"); }

                // 3. [LÓGICA NUEVA] ¿HAY RESERVA PENDIENTE?
                // Buscamos transacciones de este libro que sean RESERVAS (tipo 0)
                const reservasPendientes = await FetchController.getData('transacciones', { 'libro.id': libroId, 'tipo': 0 });

                if (reservasPendientes && reservasPendientes.length > 0) {
                    // --- CASO A: HAY RESERVA -> SE CONVIERTE EN PRÉSTAMO ---
                    const reserva = reservasPendientes[0]; // Tomamos la primera/única

                    // Preparamos los datos del nuevo préstamo
                    const hoy = new Date();
                    const fechaFin = new Date();
                    fechaFin.setDate(fechaFin.getDate() + 7); // 7 días para el nuevo dueño

                    const actualizacionReserva = {
                        tipo: 1, // ¡Magia! Pasa de Reserva a Préstamo
                        fechaInicio: hoy.toISOString(),
                        fechaFin: fechaFin.toISOString()
                    };

                    // A1. Actualizamos la transacción de la reserva en BD
                    await FetchController.patchData('transacciones', reserva.id, actualizacionReserva);

                    // A2. Actualizamos el Libro (Sigue prestado, pero ya no reservado)
                    await FetchController.patchData('libros', libroId, { prestado: true, reservado: false });

                    // A3. Actualizamos al usuario que hizo la reserva (Sincronizamos su lista)
                    const idClienteReserva = reserva.clienteResumen ? reserva.clienteResumen.id : reserva.cliente.id;
                    const clienteReserva = await FetchController.getById('usuarios', idClienteReserva);

                    if (clienteReserva) {
                        // 1. Actualizar lista de transacciones del usuario reserva
                        if (clienteReserva.listaTransacciones) {
                            const index = clienteReserva.listaTransacciones.findIndex(t => String(t.id) === String(reserva.id));
                            if (index !== -1) {
                                clienteReserva.listaTransacciones[index] = {
                                    ...clienteReserva.listaTransacciones[index],
                                    ...actualizacionReserva
                                };
                            }
                        }

                        // 2. Generar Notificación (Caso 3: Libro disponible/asignado)
                        if (!clienteReserva.notificaciones) clienteReserva.notificaciones = [];
                        
                        const biblioteca = new Biblioteca();
                        // Creamos objeto temporal con los datos actualizados para el mensaje
                        const txActualizada = { ...reserva, ...actualizacionReserva, libro: reserva.libro };
                        
                        biblioteca.notificarCliente(txActualizada, 3, clienteReserva);

                        // 3. Guardamos todo en el servidor (Transacciones actualizadas + Nueva notificación)
                        await FetchController.patchData('usuarios', idClienteReserva, {
                            listaTransacciones: clienteReserva.listaTransacciones,
                            notificaciones: clienteReserva.notificaciones
                        });
                    }

                    // A4. Mensaje especial
                    await Swal.fire('Devuelto y Reasignado', `El libro ha pasado automáticamente al usuario de la reserva.`, 'info');

                } else {
                    // --- CASO B: NO HAY RESERVA -> LIBRO QUEDA DISPONIBLE ---
                    await FetchController.patchData('libros', libroId, { prestado: false, reservado: false });
                    await Swal.fire('Devuelto', 'Libro devuelto correctamente y disponible en catálogo.', 'success');
                }

                // 4. LIMPIEZA DE TU USUARIO LOCAL (Siempre te borras el préstamo a ti mismo)
                if (usuarioLocal && usuarioLocal.listaTransacciones) {
                    const nuevaLista = usuarioLocal.listaTransacciones.filter(t => String(t.id) !== String(transaccionId));
                    
                    // [NUEVO] Generar notificación de devolución exitosa (Case 4)
                    if (!usuarioLocal.notificaciones) usuarioLocal.notificaciones = [];
                    const biblioteca = new Biblioteca();
                    // Usamos txActual que contiene los datos del libro devuelto
                    biblioteca.notificarCliente(txActual, 4, usuarioLocal);

                    usuarioLocal.listaTransacciones = nuevaLista;
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLocal));
                    
                    // Guardamos lista actualizada y la nueva notificación en el JSON
                    await FetchController.patchData('usuarios', usuarioLocal.id, { 
                        listaTransacciones: nuevaLista,
                        notificaciones: usuarioLocal.notificaciones
                    });
                }

                location.reload();

            } catch (error) {
                console.error("Error devolución:", error);
                Swal.fire('Error', 'No se pudo procesar la devolución.', 'error');
            }
        }
    }
    
    async #procesarCancelacionReserva(transaccionId) {
        const result = await Swal.fire({
            title: '¿Cancelar Reserva?',
            text: "El libro quedará libre para otros usuarios.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar'
        });

        if (result.isConfirmed) {
            try {
                // 1. Buscar transacción localmente o en servidor
                let tx = await FetchController.getById('transacciones', transaccionId);
                const usuarioLocal = JSON.parse(localStorage.getItem('usuarioLogueado'));

                if (!tx && usuarioLocal) {
                    tx = usuarioLocal.listaTransacciones.find(t => String(t.id) === String(transaccionId));
                }
                
                if (!tx) throw new Error("Reserva no encontrada.");

                // 2. Limpieza Servidor Global
                try { await FetchController.deleteData('transacciones', transaccionId); } catch(e){}

                // 3. Liberar libro (reservado: false)
                const libroId = tx.libro ? tx.libro.id : tx.libroId;
                if (libroId) {
                    await FetchController.patchData('libros', libroId, { reservado: false });
                }

                // 4. Limpieza Usuario Local
                if (usuarioLocal && usuarioLocal.listaTransacciones) {
                    const nuevaLista = usuarioLocal.listaTransacciones.filter(t => String(t.id) !== String(transaccionId));
                    usuarioLocal.listaTransacciones = nuevaLista;
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLocal));
                    
                    await FetchController.patchData('usuarios', usuarioLocal.id, { listaTransacciones: nuevaLista });
                }

                Swal.fire('Cancelada', 'La reserva ha sido cancelada.', 'success').then(() => location.reload());

            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo cancelar la reserva.', 'error');
            }
        }
    }

    async #actualizarUsuarioLocal(idTransaccionEliminada) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (usuario && usuario.listaTransacciones) {
            // Filtramos la transacción eliminada de la memoria local
            usuario.listaTransacciones = usuario.listaTransacciones.filter(t => t.id !== idTransaccionEliminada);
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            
            // También actualizamos en BD para que quede consistente
            await FetchController.patchData('usuarios', usuario.id, { 
                listaTransacciones: usuario.listaTransacciones 
            });
        }
    }

    // =========================================================
    //  LÓGICA DEL ADMIN (Ver Libros y Eliminar)
    // =========================================================
    async #iniciarVistaAdmin() {
        // Mostrar vista admin y ocultar elementos de estudiante
        this.#mostrarVistasAdmin();

        // Cargar y renderizar tabla de libros
        await this.#cargarYRenderizarLibros();

        // Inicializar eventos de la vista admin
        this.#inicializarEventosAdmin();
    }

    #mostrarVistasAdmin() {
        // Mostrar sección de admin
        const divAdmin = document.getElementById('vista_admin');
        if (divAdmin) divAdmin.classList.remove('d-none');

        // Ocultar contador de préstamos (solo para alumnos)
        const contadorDiv = document.getElementById('perfil-contador');
        if (contadorDiv) contadorDiv.closest('.p-2').classList.add('d-none');
    }

    async #cargarYRenderizarLibros() {
        const libros = await FetchController.getData('libros');

        // Validamos que el tbody exista
        const tbody = document.getElementById('body-libros-admin');
        if (!tbody) {
            console.error("ERROR CRÍTICO: No encuentro id='body-libros-admin' en el HTML");
            return;
        }

        // Generar filas HTML
        const htmlFilas = this.#generarFilasTablaLibros(libros);
        tbody.innerHTML = htmlFilas;

        // Inicializar DataTable
        this.#iniciarDataTable('#tablaLibrosAdmin');
    }

    #generarFilasTablaLibros(libros) {
        let htmlFilas = '';
        if (libros) {
            libros.forEach(libro => {
                htmlFilas += `
                    <tr class="fila-libro" data-id="${libro.id}">
                        <td class="fw-bold text-dark ps-3 celda-id">${libro.id}</td>
                        <td class="text-muted small celda-titulo">${libro.titulo}</td>
                        <td class="small fw-bold celda-autor">${libro.autor}</td>
                        <td class="small celda-genero">${libro.genero || 'N/A'}</td>
                        <td class="celda-estado">
                            ${libro.prestado
                        ? '<span class="badge bg-warning text-dark">Prestado</span>'
                        : '<span class="badge bg-success">Disponible</span>'}
                        </td>
                        <td class="text-end pe-3 celda-accion">
                            <button class="btn btn-sm btn-outline-danger rounded-pill btn-eliminar" 
                                data-id="${libro.id}">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
        return htmlFilas;
    }

    async #inicializarEventosAdmin() {
        // Obtener lista actual de libros para validación de duplicados
        const libros = await FetchController.getData('libros');

        // Eventos de botones eliminar (con event delegation)
        this.#asignarEventosEliminacionLibro();

        // Evento del botón "Nuevo Libro"
        const btnNuevoLibro = document.getElementById('btn_nuevo_libro');
        if (btnNuevoLibro) {
            btnNuevoLibro.addEventListener('click', () => this.#abrirModalNuevoLibro());
        }

        // Evento del botón "Agregar" en el modal
        const btnAgregarLibro = document.getElementById('btnAgregarLibro');
        if (btnAgregarLibro) {
            btnAgregarLibro.addEventListener('click', () => this.#procesarNuevoLibro(libros));
        }
    }

    #asignarEventosEliminacionLibro() {
        // Usar event delegation en el tbody para que funcione con filas dinámicas
        const tbody = document.getElementById('body-libros-admin');
        if (!tbody) return;

        tbody.addEventListener('click', (e) => {
            const btnEliminar = e.target.closest('.btn-eliminar');
            if (btnEliminar) {
                const libroId = btnEliminar.getAttribute('data-id');
                this.#procesarEliminacionLibro(libroId);
            }
        });

        // Event listener para doble click en filas (edición)
        tbody.addEventListener('dblclick', (e) => {
            const fila = e.target.closest('tr.fila-libro');
            if (fila && !e.target.closest('button')) {
                const libroId = fila.getAttribute('data-id');
                this.#habilitarEdicionLibro(fila);
            }
        });
    }

    async #procesarEliminacionLibro(libroId) {
        // 1. Verificar si el libro está prestado antes de permitir la eliminación
        const libro = await FetchController.getById('libros', libroId);

        if (libro && libro.prestado) {
            await Swal.fire({
                title: 'Acción no permitida',
                text: `El libro "${libro.titulo}" se encuentra actualmente PRESTADO. No se puede eliminar hasta que sea devuelto.`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const result = await Swal.fire({
            title: '¿Eliminar Libro?',
            html: `<p>Esta acción no se puede deshacer.</p><p><strong>ID del libro a eliminar: ${libroId}</strong></p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await FetchController.deleteData('libros', libroId);
            Swal.fire('Eliminado', `Libro con ID "${libroId}" ha sido eliminado.`, 'success').then(() => {
                location.reload();
            });
        }
    }

    // =========================================================
    //  VALIDACIONES GENÉRICAS
    // =========================================================
    #validarCamposLibro(id, titulo, autor, genero, librosExistentes, esEdicion = false) {
        /**
         * Valida los campos de un libro
         * @param {string} id - ID del libro (debe ser ISBN-13: formato 978-8437604947)
         * @param {string} titulo - Título del libro
         * @param {string} autor - Autor del libro
         * @param {string} genero - Categoría del libro
         * @param {array} librosExistentes - Lista de libros para validar duplicados
         * @param {boolean} esEdicion - Si es true, no valida duplicidad de ID
         * @returns {object} { valido: boolean, mensaje: string }
         */

        // Validar campos vacíos
        if (!id || !titulo || !autor || !genero) {
            return {
                valido: false,
                mensaje: 'Por favor, completa todos los campos.'
            };
        }

        // Validar que no sean solo espacios
        if (titulo.trim().length === 0 || autor.trim().length === 0 || id.trim().length === 0 || genero.trim().length === 0) {
            return {
                valido: false,
                mensaje: 'Los campos no pueden contener solo espacios.'
            };
        }

        // Validar formato ISBN-13: 978-8437604947 (3 dígitos - 10 dígitos)
        const regexISBN = /^\d{3}-\d{10}$/;
        if (!regexISBN.test(id)) {
            return {
                valido: false,
                mensaje: 'El ID debe ser un ISBN-13 válido (formato: 978-8437604947).'
            };
        }

        // Validar que el ID no exista (solo en creación, no en edición)
        if (!esEdicion) {
            const idYaExiste = librosExistentes.some(libro => libro.id === id);
            if (idYaExiste) {
                return {
                    valido: false,
                    mensaje: `El ISBN "${id}" ya existe. Por favor, usa otro identificador.`
                };
            }
        }

        return { valido: true };
    }

    // =========================================================
    //  MODAL NUEVO LIBRO (Agregar)
    // =========================================================
    #abrirModalNuevoLibro() {
        // Limpiar formulario
        const form = document.getElementById('formNuevoLibro');
        if (form) form.reset();

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoLibro'));
        modal.show();
    }

    async #procesarNuevoLibro(librosActuales) {
        // 1. Obtener valores del formulario
        const inputId = document.getElementById('inputIdLibro');
        const inputTitulo = document.getElementById('inputTituloLibro');
        const inputAutor = document.getElementById('inputAutorLibro');
        const inputGenero = document.getElementById('inputGeneroLibro');

        const id = inputId.value.trim();
        const titulo = inputTitulo.value.trim();
        const autor = inputAutor.value.trim();
        const genero = inputGenero.value.trim();

        // 2. Validar usando función genérica
        const validacion = this.#validarCamposLibro(id, titulo, autor, genero, librosActuales, false);
        if (!validacion.valido) {
            Swal.fire({
                title: 'Validación',
                text: validacion.mensaje,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // 3. Crear objeto del nuevo libro (siempre disponible: prestado = false y reservado = false)
        const nuevoLibro = {
            id: id,
            titulo: titulo,
            autor: autor,
            genero: genero,
            prestado: false,
            reservado: false
        };

        try {
            // 4. Hacer POST para agregar el libro (usando FetchController)
            await FetchController.postData('libros', nuevoLibro);

            Swal.fire({
                title: 'Éxito',
                text: `Libro "${titulo}" agregado correctamente.`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoLibro'));
                if (modal) modal.hide();

                // Recargar la página para actualizar la tabla
                location.reload();
            });
        } catch (error) {
            console.error('Error al agregar libro:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el libro. Intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    // =========================================================
    //  EDICIÓN DE LIBROS (Doble click)
    // =========================================================
    async #habilitarEdicionLibro(fila) {
        const libroId = fila.getAttribute('data-id');

        // VALIDACIÓN: Verificar si el libro está prestado antes de permitir la edición
        const libro = await FetchController.getById('libros', libroId);
        if (libro && libro.prestado) {
            await Swal.fire({
                title: 'Acción no permitida',
                text: `El libro "${libro.titulo}" está PRESTADO. No se puede editar hasta que sea devuelto.`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Obtener valores actuales de las celdas
        const titulo = fila.querySelector('.celda-titulo').innerText;
        const autor = fila.querySelector('.celda-autor').innerText;
        const genero = fila.querySelector('.celda-genero').innerText;

        // Convertir celdas a inputs editables
        fila.querySelector('.celda-id').innerHTML = `<strong>${libroId}</strong>`;
        fila.querySelector('.celda-titulo').innerHTML = `<input type="text" class="form-control form-control-sm input-edicion" id="edit-titulo" value="${titulo}">`;
        fila.querySelector('.celda-autor').innerHTML = `<input type="text" class="form-control form-control-sm input-edicion" id="edit-autor" value="${autor}">`;
        fila.querySelector('.celda-genero').innerHTML = `<input type="text" class="form-control form-control-sm input-edicion" id="edit-genero" value="${genero}">`;
        fila.querySelector('.celda-estado').innerHTML = `<span class="badge bg-success">Disponible</span>`;

        // Cambiar botones a Actualizar y Cancelar
        fila.querySelector('.celda-accion').innerHTML = `
            <button class="btn btn-sm btn-success rounded-pill btn-actualizar" data-id="${libroId}">
                <i class="bi bi-check-circle"></i> Actualizar
            </button>
            <button class="btn btn-sm btn-secondary rounded-pill btn-cancelar" data-id="${libroId}">
                <i class="bi bi-x-circle"></i> Cancelar
            </button>
        `;

        // Eventos para Actualizar y Cancelar
        fila.querySelector('.btn-actualizar').addEventListener('click', () => {
            this.#procesarActualizacionLibro(fila, libroId);
        });

        fila.querySelector('.btn-cancelar').addEventListener('click', () => {
            this.#cancelarEdicionLibro(fila, libroId);
        });

        // Enfocar el primer input
        fila.querySelector('#edit-titulo').focus();
    }

    async #procesarActualizacionLibro(fila, libroId) {
        // 1. Obtener valores del formulario
        const titulo = fila.querySelector('#edit-titulo').value.trim();
        const autor = fila.querySelector('#edit-autor').value.trim();
        const genero = fila.querySelector('#edit-genero').value.trim();

        // 2. Validar usando función genérica (esEdicion=true para no validar ID duplicado)
        const validacion = this.#validarCamposLibro(libroId, titulo, autor, genero, [], true);
        if (!validacion.valido) {
            Swal.fire({
                title: 'Validación',
                text: validacion.mensaje,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // 3. Crear objeto actualizado (siempre disponible: prestado = false)
        const libroActualizado = {
            id: libroId, // ID no se puede cambiar
            titulo: titulo,
            autor: autor,
            genero: genero,
            prestado: false
        };

        try {
            // 4. Hacer PUT para actualizar (usando FetchController)
            await FetchController.putData('libros', libroId, libroActualizado);

            Swal.fire({
                title: 'Éxito',
                text: `Libro "${titulo}" actualizado correctamente.`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                location.reload();
            });
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el libro. Intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    #cancelarEdicionLibro(fila, libroId) {
        // Simplemente recargar la página para restaurar los valores originales
        location.reload();
    }

    // =========================================================
    //  UTILIDADES (DataTables y Eventos)
    // =========================================================
    #iniciarDataTable(selector) {
        // Destruir si ya existe para evitar errores al recargar
        if ($.fn.DataTable.isDataTable(selector)) {
            $(selector).DataTable().destroy();
        }

        $(selector).DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            },
            responsive: true,
            pageLength: 5,
            lengthMenu: [5, 10, 20]
        });
    }

    #asignarEventosBotones(claseSelector, callback) {
        // Usamos delegación de eventos o querySelectorAll directo
        document.querySelectorAll(claseSelector).forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                callback(id);
            });
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const perfil = new PerfilController();
    perfil.init();
});