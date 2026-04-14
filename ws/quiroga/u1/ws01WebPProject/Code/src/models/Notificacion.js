export class Notificacion {
    // Atributos privados según el diagrama (-)
    #tipo;
    #transaccion;
    #mensaje;

    constructor(tipo, transaccion, mensaje) {
        this.#tipo = tipo;
        this.#transaccion = transaccion;
        this.#mensaje = mensaje;
    }

    // Getters y Setters
    get tipo() {
        return this.#tipo;
    }

    set tipo(valor) {
        this.#tipo = valor;
    }

    get transaccion() {
        return this.#transaccion;
    }

    set transaccion(valor) {
        this.#transaccion = valor;
    }

    get mensaje() {
        return this.#mensaje;
    }

    set mensaje(valor) {
        if (valor.length > 0) {
            this.#mensaje = valor;
        }
    }

    toJSON() {
        return {
            tipo: this.#tipo,
            transaccion: this.#transaccion,
            mensaje: this.#mensaje
        };
    }
}