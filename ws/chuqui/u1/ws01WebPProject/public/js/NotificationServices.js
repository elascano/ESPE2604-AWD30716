// js/services/NotificationService.js

// const NotificationService = {
//     containerId: 'notification-area', // cambiar segun se cree el id 

//     mostrarNotificacion: function(mensaje, tipo = 'info') {
//         const container = document.getElementById(this.containerId);
//         if (!container) return;

//         const alerta = document.createElement('div');
//         alerta.className = `alert alert-${tipo}`; // Clases CSS modulares
//         alerta.innerText = mensaje;

//         container.appendChild(alerta);

//         // Eliminar la alerta automáticamente después de 3 segundos
//         setTimeout(() => {
//             alerta.remove();
//         }, 3000);
//     },

//     //simulacion de recordatorio
//     programarRecordatorio: function(libro, segundos) {
//         console.log(`Recordatorio programado para: ${libro}`);

//         // setTimeout uso de asincronía básica 
//         setTimeout(() => {
//             this.mostrarNotificacion(`Recordatorio: Debes devolver el libro "${libro}" pronto.`, 'warning');
//         }, segundos * 1000);
//     }
// };

// export default NotificationService;

const NotificationService = {
    storageKey: 'biblioteca_notificaciones',
    maxNotifications: 50, // Límite de notificaciones

    // Obtener notificaciones del localStorage
    obtenerNotificaciones: function () {
        // localStorage.removeItem(this.storageKey); // LIMPIAR DATOS (para pruebas)
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    },

    // Guardar notificaciones en localStorage
    guardarNotificaciones: function (notificaciones) {
        // Mantener solo las últimas N notificaciones
        const limitadas = notificaciones.slice(-this.maxNotifications);
        localStorage.setItem(this.storageKey, JSON.stringify(limitadas));
    },

    // Agregar nueva notificación
    agregarNotificacion: function (tipo, titulo, mensaje, datos = {}) {
        const notificaciones = this.obtenerNotificaciones();

        const nuevaNotificacion = {
            id: Date.now() + Math.random(),
            tipo: tipo, // 'eliminado', 'agregado', 'prestado', etc.
            titulo: titulo,
            mensaje: mensaje,
            fecha: new Date().toISOString(),
            fechaFormateada: this.formatearFecha(new Date()),
            leida: false,
            datos: datos // info extra del libro, etc.
        };

        notificaciones.push(nuevaNotificacion);
        this.guardarNotificaciones(notificaciones);

        // Actualizar UI si estamos en index.html
        this.actualizarContadorUI();
        this.actualizarListaUI();

        return nuevaNotificacion;
    },

    // Formatear fecha legible
    formatearFecha: function (fecha) {
        const ahora = new Date();
        const diff = Math.floor((ahora - fecha) / 1000); // segundos

        if (diff < 60) return 'ahora';
        if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
        return `hace ${Math.floor(diff / 86400)}d`;
    },

    // Actualizar contador en la UI (solo si existe)
    actualizarContadorUI: function () {
        const contador = getById('numero_notificaciones');
        if (contador) {
            const notificaciones = this.obtenerNotificaciones();
            const noLeidas = notificaciones.filter(n => !n.leida).length;
            contador.textContent = noLeidas;
        }
    },

    // Actualizar lista en la UI (solo si existe)
    actualizarListaUI: function () {
        const container = getById('containerAlert');
        if (!container) return;

        const notificaciones = this.obtenerNotificaciones();

        // Mostrar las últimas 10 notificaciones
        const recientes = notificaciones.slice(-10).reverse();

        recientes.forEach(notif => {
            const elemento = this.crearElementoNotificacion(notif);
            container.appendChild(elemento);
        });

        // Si no hay notificaciones
        if (recientes.length === 0) {
            const vacio = createElement('li', { class: 'dropdown-item text-muted text-center' },
                'No hay notificaciones');
            container.appendChild(vacio);
        }
    },

    // Crear elemento HTML para una notificación
    crearElementoNotificacion: function (notificacion) {
        const iconos = {
            'eliminado': { color: 'bg-danger', icon: 'trash' },
            'agregado': { color: 'bg-success', icon: 'plus' },
            'prestado': { color: 'bg-warning', icon: 'book' },
            'devuelto': { color: 'bg-info', icon: 'arrow-return-left' }
            
        };

        const config = iconos[notificacion.tipo] || { color: 'bg-secondary', icon: 'info' };

        return createElement('a', {
            class: `dropdown-item py-2 px-3 ${notificacion.leida ? 'text-muted' : ''}`,
            // href: `# ${notificacion.url}`,
            href: '#',
            'data-notif-id': notificacion.id
        }, `
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-3">
                    <div class="avatar-sm ${config.color} d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z" />
                            <path
                                d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                            <path
                                d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                        </svg>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="fw-semibold text-dark">${notificacion.titulo}</div>
                    <div class="text-muted small">Estado: <span class="badge ${config.color} ms-1">${notificacion.tipo.toUpperCase()}</span></div>
                    <div class="text-muted small">${notificacion.mensaje}</div>
                </div>
                <small class="text-muted ms-2">${notificacion.fechaFormateada}</small>
            </div>
        `);
    },

    // Método específico para eliminación de libros
    mostrarNotificacionEliminacion: function (libro) {
        return this.agregarNotificacion(
            'eliminado',
            `Libro: ${libro.titulo}`,
            `• Autor: ${libro.autor} • Genero: ${libro.genero}`,
            { libroId: libro.id, titulo: libro.titulo, autor: libro.autor }
        );
    },
    mostrarNotificacionPrestamo: function (libro) {
        return this.agregarNotificacion(
            'prestado',
            `Libro: ${libro.titulo}`,
            `• Autor: ${libro.autor} • Genero: ${libro.genero}`,
            { libroId: libro.id, titulo: libro.titulo, autor: libro.autor }
        );
    },
    mostrarNotificacionDevolucion: function (libro) {
        return this.agregarNotificacion(
            'devuelto',
            `Libro: ${libro.titulo}`,
            `• Autor: ${libro.autor} • Genero: ${libro.genero}`,
            { libroId: libro.id, titulo: libro.titulo, autor: libro.autor }
        );
    },

    // Método para agregar libro
    mostrarNotificacionAgregar: function (libro) {
        return this.agregarNotificacion(
            'agregado',
            `Libro: ${libro.titulo}`,
            `• Autor: ${libro.autor} • Genero: ${libro.genero}`,
            { libroId: libro.id, titulo: libro.titulo, autor: libro.autor }
        );
    },

    // Marcar notificación como leída
    marcarComoLeida: function (notificacionId) {
        const notificaciones = this.obtenerNotificaciones();
        const notif = notificaciones.find(n => n.id == notificacionId);
        if (notif) {
            notif.leida = true;
            this.guardarNotificaciones(notificaciones);
            this.actualizarContadorUI();
        }
    },

    // Limpiar notificaciones antiguas
    limpiarNotificaciones: function () {
        localStorage.removeItem(this.storageKey);
        this.actualizarContadorUI();
        this.actualizarListaUI();
    },

    // Inicializar el sistema (llamar en index.html)
    inicializar: function () {
        this.actualizarContadorUI();
        this.actualizarListaUI();

        // Event listener para marcar como leída al hacer click
        document.addEventListener('click', (e) => {
            const notifElement = e.target.closest('[data-notif-id]');
            if (notifElement) {
                const id = notifElement.getAttribute('data-notif-id');
                this.marcarComoLeida(id);
            }
        });
    }
};

// Inicializar al cargar el script
document.addEventListener('DOMContentLoaded', () => {
    NotificationService.inicializar();
});