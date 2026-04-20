import { FetchController } from '../controllers/FetchController.js'; //
import { Notificacion } from '../models/Notificacion.js'; //
import { Biblioteca } from '../models/Biblioteca.js';

export class NotificationController {

    // Cache para guardar las notificaciones generadas y mostrarlas en el historial
    static #historialNotificaciones = [];

    constructor() {
        this.iniciar();
    }

    async iniciar() {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (!usuario || usuario.tipo === 0) return; // Solo alumnos

        // 1. Escuchar el botón de la campana
        this.#configurarBoton(usuario);
    }

    #configurarBoton(usuarioLocal) {
        const btn = document.getElementById('btn_notificaciones'); //
        if (btn) {
            // Convertimos el evento a async para manejar la carga de datos
            btn.addEventListener('click', async () => {
                // 1. Obtener datos frescos del servidor (JSON)
                // Esto asegura que leamos notificaciones generadas por otros (ej. devoluciones)
                const usuarioActualizado = await FetchController.getById('usuarios', usuarioLocal.id);
                
                if (usuarioActualizado) {
                    // 2. Verificar vencimientos (Case 2) y actualizar si es necesario
                    await this.#procesarTransacciones(usuarioActualizado);

                    // 3. Actualizar LocalStorage con la data más fresca
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioActualizado));

                    // 4. Mostrar historial (que lee del LocalStorage actualizado)
                    NotificationController.mostrarHistorial();
                }
            });
        }
    }

    async #procesarTransacciones(usuario) {
        // Traemos datos reales del servidor
        const transacciones = await FetchController.getData('transacciones', { 'cliente.id': usuario.id }); //

        if (!transacciones) return;

        // Usamos for...of para esperar a que se procesen las alertas antes de mostrar el modal
        for (const tx of transacciones) {
            if (tx.tipo === 1) { // Solo préstamos
                // [CASO 2] Verificamos si vence mañana y guardamos la notificación
                await NotificationController.programarPorFecha(tx, usuario);
            }
        }
    }

    // ---------------------------------------------------------
    // MÉTODOS (Adaptados con SweetAlert)
    // ---------------------------------------------------------

    static programarPorCronometro(notificacion, tiempoEnMs) {
        console.log(`⏳ Notificación programada en ${tiempoEnMs / 1000} segundos...`);
        setTimeout(() => {
            this.mostrarEnVista(notificacion, 'info');
        }, tiempoEnMs);
    }

    static async programarPorFecha(transaccion, usuario) {
        const fechaFin = new Date(transaccion.fechaFin).getTime();
        const ahora = new Date().getTime();
        const tiempoRestante = fechaFin - ahora;
        
        // 1 día en milisegundos
        const unDia = 24 * 60 * 60 * 1000;

        // [CASO 2] Si falta 1 día o menos (y no ha vencido aún)
        if (tiempoRestante > 0 && tiempoRestante <= unDia) {
            const biblioteca = new Biblioteca();
            
            // Guardamos referencia de las notificaciones actuales para verificar duplicados
            const notificacionesOriginales = [...(usuario.notificaciones || [])];
            
            // 1. Generar notificación (esto hace push a usuario.notificaciones)
            const nuevaNotificacion = biblioteca.notificarCliente(transaccion, 2, usuario);

            // 2. Verificar si el mensaje YA existía para no spammear ni duplicar en BD
            const yaExiste = notificacionesOriginales.some(n => n.mensaje === nuevaNotificacion.mensaje);

            if (yaExiste) {
                // Si ya existe, restauramos el array original y salimos (no guardamos ni mostramos toast)
                usuario.notificaciones = notificacionesOriginales;
                return;
            }

            // 3. Si es nueva: GUARDAR EN JSON (Persistencia)
            await FetchController.patchData('usuarios', usuario.id, {
                notificaciones: usuario.notificaciones
            });

            // 4. Mostrar alerta visual
            this.mostrarEnVista(nuevaNotificacion, 'warning'); 
        }
    }

    // ---------------------------------------------------------
    // LA VISTA (Mejorada con SweetAlert2)
    // ---------------------------------------------------------
    static mostrarEnVista(notificacion, icono = 'info') {
        // 1. Guardar en historial para el botón
        this.#historialNotificaciones.push({
            msg: notificacion.mensaje,
            icon: icono,
            date: new Date()
        });

        // 2. Mostrar Toast elegante
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: icono,
            title: 'Biblioteca Informa',
            text: notificacion.mensaje
        });
    }

    // ---------------------------------------------------------
    // NUEVO: Acción del Botón de Campana
    // ---------------------------------------------------------
    static mostrarHistorial() {
        // Leemos directamente del usuario en sesión (que tiene los datos del JSON)
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        
        if (!usuario || !usuario.notificaciones || usuario.notificaciones.length === 0) {
            Swal.fire('Sin novedades', 'No tienes notificaciones.', 'info');
            return;
        }

        // Generamos una lista HTML para el modal
        let htmlLista = '<ul class="list-group text-start">';
        
        // Mostramos las notificaciones (invertimos para ver las nuevas primero)
        [...usuario.notificaciones].reverse().forEach(n => {
            // Validar que el mensaje exista para evitar "undefined"
            if (!n.mensaje) return;

            // Determinamos color según el tipo (si existe) o por defecto
            let color = (n.tipo === 2) ? 'text-warning' : (n.tipo === 3 || n.tipo === 4 ? 'text-success' : 'text-primary');
            let icono = (n.tipo === 2) ? 'bi-exclamation-triangle-fill' : (n.tipo === 4 ? 'bi-check-circle-fill' : 'bi-bell-fill');

            htmlLista += `
                <li class="list-group-item d-flex align-items-start">
                    <i class="bi ${icono} ${color} me-2 mt-1"></i>
                    <div>
                        ${n.mensaje}
                    </div>
                </li>`;
        });
        htmlLista += '</ul>';

        Swal.fire({
            title: '<strong>Tus Notificaciones</strong>',
            icon: 'info',
            html: htmlLista,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Cerrar'
        });
    }

    // ---------------------------------------------------------
    // NUEVO: Alerta tipo "Toast" solicitada
    // ---------------------------------------------------------
    static mostrarConfirmacion(titulo) {
        Swal.fire({
            icon: "success",
            title: titulo,
            showConfirmButton: false,
            timer: 2500 // Un poco más de tiempo para leer
        });
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    new NotificationController();
});