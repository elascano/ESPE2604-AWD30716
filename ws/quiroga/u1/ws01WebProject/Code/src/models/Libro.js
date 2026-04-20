export class Libro {
    #id; 
    #titulo; 
    #autor; 
    #genero; 
    #prestado; 
    #reservado;

    constructor(id, titulo, autor, genero, prestado = false, reservado = false) {
        this.#id = id;
        this.#titulo = titulo;
        this.#autor = autor;
        this.#genero = genero;
        this.#prestado = prestado;
        this.#reservado = reservado;
    }

    get id() { return this.#id; }
    set id(val) { this.#id = val; }

    get titulo() { return this.#titulo; }
    set titulo(val) { this.#titulo = val; }

    get autor() { return this.#autor; }
    set autor(val) { this.#autor = val; }

    get genero() { return this.#genero; }
    set genero(val) { this.#genero = val; }

    get prestado() { return this.#prestado; }
    set prestado(val) { this.#prestado = val; }

    get reservado() { return this.#reservado; }
    set reservado(val) { this.#reservado = val; }
}