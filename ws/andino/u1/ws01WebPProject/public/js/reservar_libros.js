// reservar_libros.js - Sistema de reservas de libros

// CLASE RESERVA (Programación Orientada a Objetos)

class Reserva {
    constructor(libroId, titulo, autor, categoria, diasPrestamo) {
        this.libro_id = libroId;
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
        this.fechaReserva = obtenerFechaActual();
        this.diasPrestamo = diasPrestamo;
        this.estado = 'Reservado';
    }
}

// Variables globales
let reservas = [];
let libroPendiente = null;
let modalDiasPrestamo = null;
let modalConfirmacion = null;
let diasSeleccionadosTemp = 0;

// Funciones de manejo de fechas
function obtenerFechaActual() {
    return formatearFecha(new Date());
}

function formatearFecha(fecha) {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function calcularDiasRestantes(fechaReservaStr, diasPrestamo) {
    const [dia, mes, año] = fechaReservaStr.split('/').map(Number);
    const fechaReserva = new Date(año, mes - 1, dia);
    const hoy = new Date();
    const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const reservaSinHora = new Date(fechaReserva.getFullYear(), fechaReserva.getMonth(), fechaReserva.getDate());
    const diffMs = hoySinHora - reservaSinHora;
    const diasTranscurridos = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diasPrestamo - diasTranscurridos;
}

function calcularFechaVencimiento(diasPrestamo) {
    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    fecha.setDate(fecha.getDate() + diasPrestamo);
    return fecha;
}

// Mostrar notificación toast
function mostrarNotificacion(mensaje, tipo = 'success') {
    const contenedor = document.getElementById('notificacionesContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensaje}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    contenedor.appendChild(toast);
    const toastBootstrap = new bootstrap.Toast(toast);
    toastBootstrap.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// FUNCIÓN ASÍNCRONA: Verificar disponibilidad con Promesas
// Simula consulta al servidor con 3 segundos de espera
async function verificarDisponibilidad(libroAgrupado) {
    console.log('Verificando disponibilidad en el servidor');
    
    if (typeof mostrarSpinner === 'function') {
        mostrarSpinner();
    }

    // Promesa que simula latencia del servidor
    let miPromesa = new Promise((resolver, rechazar) => {
        setTimeout(() => {
            let copiaEncontrada = null;
            let yaReservado = false;
            
            // Buscar copia disponible usando find()
            copiaEncontrada = libroAgrupado.copias.find(copia => copia.disponible);

            // Verificar si ya tiene el libro reservado usando some()
            yaReservado = reservas.some(reserva => 
                reserva.titulo === libroAgrupado.titulo && reserva.estado === 'Reservado'
            );

            if (copiaEncontrada && !yaReservado) {
                resolver(copiaEncontrada);
            } else {
                let mensajeError = 'No hay copias disponibles de este libro';
                if (yaReservado) {
                    mensajeError = 'Ya tienes una copia de este libro reservada';
                }
                rechazar(mensajeError);
            }
                
        }, 3000); // 3 segundos de espera
    });

    return miPromesa;
}

// FUNCIÓN PRINCIPAL: Reservar libro (async/await)
async function reservarLibro(libroAgrupado, diasPrestamo) {
    
    try {
        // Await: espera a que la promesa se resuelva (3 segundos)
        const copiaDisponible = await verificarDisponibilidad(libroAgrupado);

        // Si la verificación fue exitosa, crear reserva usando la Clase
        const nuevaReserva = new Reserva(
            copiaDisponible.libro_id,
            libroAgrupado.titulo,
            libroAgrupado.autor,
            libroAgrupado.categoria,
            diasPrestamo
        );
        
        // Agregar reserva al array usando push()
        reservas.push(nuevaReserva);
        
        // Marcar copia como no disponible
        copiaDisponible.disponible = false;
        libroAgrupado.cantidadDisponible--;
        
        // Actualizar en el array original de libros
        const libroOriginal = libros.find(l => l.libro_id === copiaDisponible.libro_id);
        if (libroOriginal) {
            libroOriginal.disponible = false;
        }
        
        actualizarTablaReservas();
        cargarCards(paginaActual);
        mostrarNotificacion(`"${libroAgrupado.titulo}" reservado exitosamente`, 'success');
        
        setTimeout(() => {
            document.getElementById('mis-prestamos').scrollIntoView({ behavior: 'smooth' });
        }, 500);

    } catch (error) {
        // Si la promesa fue rechazada, mostrar error
        console.error('Error en reserva:', error);
        mostrarNotificacion(error, 'warning');
        cargarCards(paginaActual);
    }
}

// Actualizar tabla de reservas usando forEach()
function actualizarTablaReservas() {
    const tbody = document.getElementById('tablaPrestamos');
    tbody.innerHTML = '';
    
    if (reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-soft">No tienes libros reservados actualmente</td>
            </tr>
        `;
        return;
    }
    
    reservas.forEach((reserva, index) => {
        const tr = document.createElement('tr');
        const diasRestantes = calcularDiasRestantes(reserva.fechaReserva, reserva.diasPrestamo);
        let badgeColor = 'bg-success';
        let diasTexto = `${diasRestantes} días`;

        if (diasRestantes <= 0) {
            badgeColor = 'bg-danger';
            diasTexto = diasRestantes === 0 ? 'Vence hoy' : 'Vencido';
        } else if (diasRestantes <= 3) {
            badgeColor = 'bg-warning text-dark';
        }
        
        tr.innerHTML = `
            <td>
                <div>
                    <strong>${reserva.titulo}</strong>
                    <br>
                    <small class="text-soft">${reserva.autor}</small>
                </div>
            </td>
            <td>${reserva.fechaReserva}</td>
            <td>
                <span class="badge bg-success">${reserva.estado}</span>
            </td>
            <td>
                <span class="badge ${badgeColor}">${diasTexto}</span>
                <div class="small text-soft">de ${reserva.diasPrestamo} días</div>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-danger" onclick="devolverLibro(${index})">
                    Devolver
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Devolver libro usando splice() y find()
function devolverLibro(indexReserva) {
    const reserva = reservas[indexReserva];
    
    // Marcar libro como disponible usando find()
    const libroOriginal = libros.find(l => l.libro_id === reserva.libro_id);
    if (libroOriginal) {
        libroOriginal.disponible = true;
    }
    
    const libroAgrupado = librosActuales.find(lg => lg.titulo === reserva.titulo);
    if (libroAgrupado) {
        const copia = libroAgrupado.copias.find(c => c.libro_id === reserva.libro_id);
        if (copia) {
            copia.disponible = true;
            libroAgrupado.cantidadDisponible++;
        }
    }
    
    // Eliminar reserva usando splice()
    reservas.splice(indexReserva, 1);
    
    actualizarTablaReservas();
    cargarCards(paginaActual);
    mostrarNotificacion(`"${reserva.titulo}" devuelto correctamente`, 'info');
}


// Delegación de eventos y manejo de modales
document.addEventListener('DOMContentLoaded', function() {
    actualizarTablaReservas();

    const modalElemento = document.getElementById('modalDiasPrestamo');
    modalDiasPrestamo = new bootstrap.Modal(modalElemento);
    
    const modalConfirmElemento = document.getElementById('modalConfirmacion');
    modalConfirmacion = new bootstrap.Modal(modalConfirmElemento);

    const rangeDiasPrestamo = document.getElementById('rangeDiasPrestamo');
    const labelDiasPrestamo = document.getElementById('labelDiasPrestamo');
    const textoVence = document.getElementById('textoVence');
    const btnConfirmarReserva = document.getElementById('btnConfirmarReserva');
    const btnFinalizarReserva = document.getElementById('btnFinalizarReserva');

    function actualizarPreviewPrestamo() {
        const dias = Number(rangeDiasPrestamo.value);
        labelDiasPrestamo.textContent = dias === 1 ? '1 día' : `${dias} días`;
        textoVence.textContent = formatearFecha(calcularFechaVencimiento(dias));
    }
    
    // Delegación de eventos - un solo listener para todos los botones "Reservar"
    const gridLibros = document.getElementById('gridLibros');
    
    gridLibros.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' && e.target.textContent.trim() === 'Reservar') {
            const card = e.target.closest('.col-md-6');
            const todasLasCards = Array.from(gridLibros.querySelectorAll('.col-md-6'));
            const indiceCard = todasLasCards.indexOf(card);
            
            // Calcular índice real considerando paginación
            const inicio = (paginaActual - 1) * librosXPagina;
            const indiceReal = inicio + indiceCard;
            const libroSeleccionado = librosActuales[indiceReal];
            
            if (libroSeleccionado) {
                libroPendiente = libroSeleccionado;
                rangeDiasPrestamo.value = '7';
                actualizarPreviewPrestamo();
                modalDiasPrestamo.show();
            }
        }
    });

    rangeDiasPrestamo.addEventListener('input', actualizarPreviewPrestamo);

    btnConfirmarReserva.addEventListener('click', function() {
        if (!libroPendiente) {
            modalDiasPrestamo.hide();
            return;
        }

        diasSeleccionadosTemp = Number(rangeDiasPrestamo.value);
        document.getElementById('confirmaTitulo').textContent = libroPendiente.titulo;
        document.getElementById('confirmaDias').textContent = 
            diasSeleccionadosTemp === 1 ? '1 día' : `${diasSeleccionadosTemp} días`;

        modalDiasPrestamo.hide();
        modalConfirmacion.show();
    });

    // Ejecuta la función async reservarLibro()
    btnFinalizarReserva.addEventListener('click', function() {
        if (libroPendiente && diasSeleccionadosTemp > 0) {
            reservarLibro(libroPendiente, diasSeleccionadosTemp);
            libroPendiente = null;
            diasSeleccionadosTemp = 0;
            modalConfirmacion.hide();
        }
    });

    actualizarPreviewPrestamo();
});