export class Transaccion {
    #id; 
    #libro; 
    #fechaInicio; 
    #fechaFin; 
    #cliente; 
    #tipo; // 1: Préstamo, 0: Reserva

    constructor(id, libro, fechaInicio, fechaFin, cliente, tipo) {
        this.#id = id;
        this.#libro = libro;
        this.#fechaInicio = fechaInicio;
        this.#fechaFin = fechaFin;
        this.#cliente = cliente;
        this.#tipo = tipo;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get libro() { return this.#libro; }
    get fechaInicio() { return this.#fechaInicio; }
    get fechaFin() { return this.#fechaFin; }
    get cliente() { return this.#cliente; } // Retorna el objeto Cliente asociado
    get tipo() { return this.#tipo; }

    // --- SETTERS ---
    set id(val) { this.#id = val; }
    set libro(val) { this.#libro = val; }
    set fechaInicio(val) { this.#fechaInicio = val; }
    set fechaFin(val) { this.#fechaFin = val; }
    set cliente(val) { this.#cliente = val; }
    set tipo(val) { this.#tipo = val; }

    /**
     * MÉTODO CLAVE: toJSON
     * Permite que JSON.stringify(transaccion) funcione correctamente
     * para guardar en LocalStorage o ver en consola.
     */
    toJSON() {
        return {
            id: this.#id,
            // Guardamos el objeto libro (asegúrate que Libro también tenga toJSON si usas privados)
            libro: this.#libro, 
            fechaInicio: this.#fechaInicio,
            fechaFin: this.#fechaFin,
            // Para el cliente, a veces es mejor guardar solo el ID o Nombre para evitar referencias circulares gigantes
            clienteResumen: { id: this.#cliente.id, nombre: this.#cliente.nombre },
            tipo: this.#tipo
        };
    }
}