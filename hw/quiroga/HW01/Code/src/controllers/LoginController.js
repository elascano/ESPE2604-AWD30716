// controllers/LoginController.js
import { Biblioteca } from '../models/Biblioteca.js';
import { FetchController } from '../controllers/FetchController.js'; 

export class LoginController {
    #biblioteca;

    constructor() {
        this.#biblioteca = new Biblioteca();
    }

    async init() {
        try {
            // Mostramos un pequeño "Toast" de carga mientras conecta
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });

            // 1. CARGA DE DATOS
            const listaUsuarios = await FetchController.getData('usuarios');
            
            if (listaUsuarios && listaUsuarios.length > 0) {
                this.#biblioteca.usuarios = listaUsuarios;
                console.log(`✅ Sistema listo: ${listaUsuarios.length} usuarios cargados.`);
            } else {
                // ALERTA: Error de conexión
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor de datos (JSON Server).',
                    footer: 'Asegúrate de ejecutar: npm run server'
                });
            }

            // 2. Activamos el formulario
            this.#configurarEventoSubmit();

        } catch (error) {
            console.error("❌ Error crítico:", error);
        }
    }

    #configurarEventoSubmit() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.#procesarLogin();
        });
    }

    #procesarLogin() {
        // CAMBIO: Obtenemos el valor del input 'username'
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if(!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Ingresa tu usuario y contraseña.'
            });
            return;
        }

        // Consultamos al modelo (que ahora busca por username)
        const usuario = this.#biblioteca.autenticarUsuario(username, password);

        if (usuario) {
            // ÉXITO
            const sesionData = {
                id: usuario.id,
                nombre: usuario.nombre,
                username: usuario.username, // Guardamos username en sesión
                email: usuario.email,
                tipo: usuario.tipo,
                ...(usuario.tipo === 1 && {
                    listaTransacciones: usuario.listaTransacciones,
                    notificaciones: usuario.notificaciones
                })
            };
            localStorage.setItem('usuarioLogueado', JSON.stringify(sesionData));

            Swal.fire({
                icon: 'success',
                title: `¡Hola, ${usuario.username}!`, // Saludo con username
                text: 'Iniciando sesión...',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Redirección basada en el rol (0: Admin -> Perfil, 1: Cliente -> Home)
                if (usuario.tipo === 0) {
                    window.location.href = 'perfil.html';
                } else {
                    window.location.href = 'index.html';
                }
            });

        } else {
            // ERROR
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Usuario o contraseña incorrectos.',
                confirmButtonColor: '#d33'
            });
            document.getElementById('password').value = '';
        }
    }
}

// [REQUISITO PDF] IIFE (Función Autoejecutable) para aislar el scope de inicio
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const controller = new LoginController();
        controller.init();
    });
})();