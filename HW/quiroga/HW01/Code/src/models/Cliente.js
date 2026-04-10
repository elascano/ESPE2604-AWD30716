import { Usuario } from './Usuario.js';

export class Cliente extends Usuario {
    #listaTransacciones = []; // Contiene tanto préstamos (tipo 1) como reservas (tipo 0)
    #notificaciones = [];

    constructor(id, nombre, apellido, email, username, password, tipo) {
        super(id, nombre, apellido, email, username, password, tipo);
        this.#listaTransacciones = [];
        this.#notificaciones = [];
    }

    // Retornamos la referencia directa para que biblioteca.js pueda hacer .push()
    get listaTransacciones() { return this.#listaTransacciones; }
    set listaTransacciones(val) { this.#listaTransacciones = val; }

    get notificaciones() { return this.#notificaciones; }
    set notificaciones(val) { this.#notificaciones = val; }

    // Métodos auxiliares para filtrar transacciones
    get listaPrestamos() {
        return this.#listaTransacciones.filter(tx => tx.tipo === 1);
    }

    get listaReservas() {
        return this.#listaTransacciones.filter(tx => tx.tipo === 0);
    }

    //Este método une los datos del padre (Usuario) con los del hijo (Cliente)
    toJSON() {
        return {
            ...super.toJSON(), // Hereda id, nombre, email, etc.
            listaTransacciones: this.#listaTransacciones,
            notificaciones: this.#notificaciones
        };
    }

    // --- MÉTODOS HEREDADOS (SOBREESCRITURA OBLIGATORIA) ---
    
    /**
     * Implementación del método abstracto de Usuario.
     * El cliente busca libros para ver si puede pedirlos.
     */
    consultarLibro(clave, valor) {
        console.log(`[CLIENTE] Consultando disponibilidad de libro por ${clave}: ${valor}`);
        // En una app real, aquí llamaríamos a la vista para filtrar, 
        // pero a nivel de modelo devolvemos true validando la acción.
        return true;
    }

    // --- MÉTODOS PROPIOS DEL CLIENTE (Interacción con Biblioteca) ---

    /**
     * Solicita un préstamo a la biblioteca.
     * @param {string} idLibro - El ISBN del libro
     * @param {Biblioteca} biblioteca - La instancia de la biblioteca (necesaria para operar)
     */
    solicitarPrestamo(idLibro, biblioteca) {
        console.log(`[CLIENTE] ${this.nombre} está intentando prestar el libro ISBN: ${idLibro}`);
        
        // 1. Buscamos el libro en la biblioteca
        const libro = biblioteca.buscarLibro('ISBN', idLibro);

        if (libro) {
            // 2. Pedimos a la biblioteca que procese el préstamo
            // biblioteca.prestarLibro retorna la transacción si fue exitosa o null si falló
            const transaccion = biblioteca.prestarLibro(libro, this);
            
            if (transaccion) {
                console.log("✅ Solicitud de préstamo exitosa.");
                // Nota: biblioteca.prestarLibro ya hace el push a nuestra listaPrestamos
            } else {
                console.error("❌ La biblioteca rechazó el préstamo (Libro ocupado o reglas violadas).");
            }
        } else {
            console.error("❌ El libro solicitado no existe en el catálogo.");
        }
    }

    /**
     * Solicita una reserva si el libro está ocupado.
     * @param {string} idLibro 
     * @param {Biblioteca} biblioteca 
     */
    solicitarReserva(idLibro, biblioteca) {
        console.log(`[CLIENTE] ${this.nombre} solicitando reserva para ISBN: ${idLibro}`);
        
        const libro = biblioteca.buscarLibro('ISBN', idLibro);

        if (libro) {
            const transaccion = biblioteca.crearReserva(libro, this);
            if (transaccion) {
                console.log("✅ Reserva creada exitosamente. Te notificaremos cuando esté listo.");
            } else {
                console.error("❌ No se pudo crear la reserva.");
            }
        } else {
            console.error("❌ Libro no encontrado para reservar.");
        }
    }

}