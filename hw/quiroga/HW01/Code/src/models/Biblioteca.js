import { Libro } from "./Libro.js";
import { Transaccion } from "./Transaccion.js";
import { Notificacion } from "./Notificacion.js";
import { Cliente } from "./Cliente.js";
import { Administrador } from "./Administrador.js";

export class Biblioteca {
    // Atributo privado (-)
    #inventario; // Tipo Libro[]
    #usuarios;

    constructor(inventario = []) {
        this.#inventario = [];
        this.#usuarios = [];
    }

    // Getter y Setter para el inventario
    get inventario() {
        return this.#inventario;
    }

    set inventario(nuevoInventario) {
        this.#inventario = nuevoInventario;
    }

    set usuarios(listaUsuarios) {
        this.#usuarios = listaUsuarios;
    }

    get usuarios() {
        return this.#usuarios;
    }

    /**
     * @param {string} clave  
     * @param {string} valor
     * @returns {Libro[]}
     */
    filtrarLibros(clave, valor) {
        return this.#inventario.filter(libro => libro[clave] === valor);
    }

    /**
     * @param {string} clave
     * @param {string} valor
     * @returns {Libro}
     */
    buscarLibro(clave, valor) {
        return this.#inventario.find(libro => libro[clave] === valor);
    }

    /**
     * @param {Libro} libro
     * @param {int} tipoTransaccion 1 para prestamos, 0 para reservas
     * @returns {boolean}
     */
    aprobarTransaccion(libroObj, tipoTransaccion) {
        // Aseguramos que trabajamos con el libro del inventario real
        const libroEncontrado = this.buscarLibro('ISBN', libroObj.ISBN);

        if (libroEncontrado) {
            // [CORRECCIÓN 3] Usamos la variable correcta 'tipoTransaccion'
            if (libroEncontrado.prestado && tipoTransaccion === 1) {
                console.warn("❌ El libro ya está prestado.");
                return false;
            } else if (libroEncontrado.reservado && tipoTransaccion === 0) {
                console.warn("❌ El libro ya está reservado.");
                return false;
            } else {
                return true;
            }
        } else {
            console.error("❌ El libro no se encuentra en el inventario");
            return false;
        }
    }

    /**
     * @param {Libro} libro
     * @param {Cliente} cliente
     * @returns {Transaccion}
     */
    crearReserva(libro, cliente) {
        // [CORRECCIÓN] Pasamos 0 explícitamente para indicar Reserva
        if (this.aprobarTransaccion(libro, 0)) {
            libro.reservado = true;
            
            let transaccion = new Transaccion(
                `${cliente.id}-${libro.ISBN}-${Date.now()}-0`,
                libro,
                new Date(), 
                null, // Reserva no tiene fecha fin fija inicial
                cliente,
                0
            );
            
            // Usamos listaTransacciones (que contiene tanto préstamos como reservas)
            cliente.listaTransacciones.push(transaccion);
            
            console.log("✅ Reserva creada con éxito.");
            return transaccion;
        }
        return null;
    }

    /**
     * @param {Libro} libro
     * @param {Cliente} cliente
     * @returns {Transaccion}
     */
    prestarLibro(libro, cliente) {
        // [CORRECCIÓN 2] Llamamos al método correcto 'aprobarTransaccion' con tipo 1 (Préstamo)
        if (this.aprobarTransaccion(libro, 1)) {
            libro.prestado = true;

            let fechaActual = new Date();
            
            // [CORRECCIÓN 4] Lógica correcta para sumar 7 días en JS
            let fechaDevolucion = new Date();
            fechaDevolucion.setDate(fechaActual.getDate() + 7);

            let transaccion = new Transaccion(
                `${cliente.id}-${libro.ISBN}-${Date.now()}-1`,
                libro,
                fechaActual, 
                fechaDevolucion, 
                cliente,
                1
            );

            // Usamos listaTransacciones (que contiene tanto préstamos como reservas)
            cliente.listaTransacciones.push(transaccion);
            
            console.log("Libro prestado con éxito.");
            return transaccion;
        } else {
            console.warn("No se puede prestar el libro.");
            return null;
        }
    }

    /**
     * @param {Transaccion} transaccion
     * @param {number} tipoNotificacion
     * @param {Cliente} cliente
     * @returns {Notificacion}
     */
    notificarCliente(transaccion, tipoNotificacion, cliente) {
        let mensaje = "";
        switch(tipoNotificacion){
            case 0:
                const fechaDev = new Date(transaccion.fechaFin);
                mensaje = `¡${cliente.nombre}, tu préstamo del libro "${transaccion.libro.titulo}" ha sido aprobado!
                            Devuélvelo antes del ${fechaDev.toLocaleDateString()}.`;
            break;
            case 1:
                mensaje = `¡${cliente.nombre}, tu reserva del libro "${transaccion.libro.titulo}" ha sido aprobada!`;
            break;
            case 2:
                mensaje = `¡${cliente.nombre}, tu préstamo del libro "${transaccion.libro.titulo}" vence mañana!
                            Evita multas!.`;
            break;
            case 3:
                const fechaVenc = new Date(transaccion.fechaFin);
                mensaje = `¡${cliente.nombre}, el libro "${transaccion.libro.titulo}" ha sido asignado a tu cuenta!
                            Tienes hasta el ${fechaVenc.toDateString()} para devolverlo.`;
            break;
            case 4:
                mensaje = `¡${cliente.nombre}, tu libro "${transaccion.libro.titulo}" ha sido devuelto con éxito!`;
                break;
        }

        let notificacion = new Notificacion(
            tipoNotificacion,
            transaccion,
            mensaje
        );

        // Agregar notificación al cliente
        cliente.notificaciones.push(notificacion);
        return notificacion;
    }

    #restaurarUsuario(usuarioData) {
        if (!usuarioData) return null;

        // Si es CLIENTE (Tipo 1)
        if (usuarioData.tipo === 1) {
            const cliente = new Cliente(
                usuarioData.id,
                usuarioData.nombre,
                usuarioData.apellido,
                usuarioData.email,
                usuarioData.username,
                usuarioData.password,
                usuarioData.tipo
            );

            // Recuperamos listaTransacciones si existe en el JSON
            if (usuarioData.listaTransacciones) {
                cliente.listaTransacciones = usuarioData.listaTransacciones;
            }
            // Backward compatibility: si existen las listas antiguas, las fusionamos
            else if (usuarioData.listaPrestamos || usuarioData.listaReservas) {
                const listaFusionada = [];
                if (usuarioData.listaPrestamos) listaFusionada.push(...usuarioData.listaPrestamos);
                if (usuarioData.listaReservas) listaFusionada.push(...usuarioData.listaReservas);
                cliente.listaTransacciones = listaFusionada;
            }
            
            if (usuarioData.notificaciones) cliente.notificaciones = usuarioData.notificaciones;

            return cliente;
        } 
        // Si es ADMIN (Tipo 0)
        else {
            return new Administrador(
                usuarioData.id,
                usuarioData.nombre,
                usuarioData.apellido,
                usuarioData.email,
                usuarioData.username,
                usuarioData.password,
                usuarioData.tipo
            );
        }
    }

    /**
     * Valida credenciales sobre la lista que ya tenemos en memoria
     */
    autenticarUsuario(usernameInput, passwordInput) {
        if (!this.#usuarios || this.#usuarios.length === 0) return null;

        // 1. Buscamos en el array (que tiene objetos planos del JSON)
        const encontrado = this.#usuarios.find(u => 
            u.username === usernameInput && u.password === passwordInput
        );
        
        // 2. Si existe, lo "hidratamos" (convertimos a Clase real)
        if (encontrado) {
            return this.#restaurarUsuario(encontrado);
        }
        return null;
    }
}
