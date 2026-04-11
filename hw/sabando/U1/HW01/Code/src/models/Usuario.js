export class Usuario {
    static #instancia = null;
    #id; #nombre; #apellido; #email; #username; #password; #tipo;

    constructor(id, nombre, apellido, email, username, password, tipo) {
        if (this.constructor === Usuario) {
            throw new Error("No se puede instanciar una clase abstracta.");
        }
        //if (Usuario.#instancia) return Usuario.#instancia;

        this.#id = id;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#email = email;
        this.#username = username;
        this.#password = password;
        this.#tipo = tipo;
        //Usuario.#instancia = this;
    }

    // Getters y Setters
    get id() { return this.#id; }
    set id(val) { this.#id = val; }

    get nombre() { return this.#nombre; }
    set nombre(val) { this.#nombre = val; }

    get apellido() { return this.#apellido; }
    set apellido(val) { this.#apellido = val; }

    get email() { return this.#email; }
    set email(val) { 
        if (nuevoEmail.includes('@')) this.#email = nuevoEmail;
        else console.error("Email inválido"); 
    }

    get username() { return this.#username; }
    set username(val) { this.#username = val; }

    //get password() { return "********"; } // Protección de datos
    get password() { return this.#password; }
    set password(val) { 
        if (nuevoPassword.length >= 4) this.#password = nuevoPassword;
        else console.error("La contraseña debe tener al menos 4 caracteres");
    }

    get tipo() { return this.#tipo; }
    set tipo(val) { this.#tipo = val; }

    // Métodos estáticos del diagrama
    static getInstance() { return Usuario.#instancia; }
    
    logout() { 
        Usuario.#instancia = null;
        console.log(" Sesión cerrada");
    }
    //consultarLibro(clave, valor) { return false; }

   /**
     * Valida las credenciales y, si son correctas, establece la sesión.
     * @param {string} passwordInput - La contraseña ingresada en el Login
     * @returns {boolean} true si el login fue exitoso
     */
    login(passwordInput) {
        if (this.#password === passwordInput) {
            // Aquí aplicamos el Singleton: Guardamos ESTA instancia como la activa
            Usuario.#instancia = this;
            console.log(`Sesión iniciada para: ${this.username}`);
            return true;
        } else {
            console.warn("Contraseña incorrecta");
            return false;
        }
    }

    /**
     * Método para convertir los campos privados a un objeto JSON estándar.
     * IMPORTANTE: Sin esto, JSON.stringify(usuario) devolvería "{}" vacío
     * porque los campos con # no son serializables por defecto.
     */
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            apellido: this.#apellido,
            email: this.#email,
            username: this.#username,
            tipo: this.#tipo,
            role: this.#tipo === 0 ? 'Administrador' : 'Cliente' // Ayuda visual
        };
    }

    // --- MÉTODOS ABSTRACTOS (Para sobreescribir) ---

    /**
     * Método abstracto simulado. Debe ser implementado por los hijos.
     */
    consultarLibro(clave, valor) {
        throw new Error("El método 'consultarLibro' debe ser implementado por las clases hijas.");
    }
}