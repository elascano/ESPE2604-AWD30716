import { Usuario } from './Usuario.js';
import { Libro } from './Libro.js';

export class Administrador extends Usuario {
    /**
     * El constructor recibe los parámetros y los pasa a la clase padre (Usuario)
     * para mantener la coherencia del perfil.
     */
    constructor(id, nombre, apellido, email, username, password, tipo) {
        super(id, nombre, apellido, email, username, password, tipo);
    }

    /**
     * --- MÉTODOS DE LA CLASE PADRE (SOBREESCRITURA OBLIGATORIA) ---
     * Implementamos consultarLibro para que el Admin no sea una clase abstracta.
     */
    consultarLibro(clave, valor) {
        // El administrador podría tener una búsqueda más detallada (ej. ver libros ocultos)
        console.log(`[ADMIN SYSTEM] Buscando libro por ${clave}: ${valor}`);
        // Retornamos true para indicar que el Admin tiene permiso de búsqueda total
        return true;
    }

    /**
     * --- MÉTODOS PROPIOS DEL ADMINISTRADOR ---
     */

    /**
     * Crea una nueva instancia de un Libro.
     * @param {string} isbn - El identificador único
     * @param {string} titulo 
     * @param {string} autor 
     * @param {string} genero 
     * @returns {Libro} El objeto libro listo para ser agregado al array de la Biblioteca
     */
    agregarLibro(isbn, titulo, autor, genero) {
        if (!isbn || !titulo || !autor) {
            throw new Error("Datos incompletos para crear el libro.");
        }
        
        console.log(`[ADMIN] Creando nuevo libro: ${titulo}`);
        // Retornamos la instancia. El Controller se encargará de hacer .push() al inventario.
        return new Libro(isbn, titulo, autor, genero);
    }

    /**
     * Elimina un libro del inventario dado.
     * Nota: En el diagrama es borrarLibro(id), pero en JS necesitamos pasar el array
     * sobre el cual actuar, ya que no tenemos base de datos global.
     * * @param {string} id - ISBN del libro a borrar
     * @param {Array<Libro>} inventario - El array de libros de la biblioteca
     * @returns {boolean} True si se borró, False si no se encontró
     */
    borrarLibro(id, inventario) {
        const index = inventario.findIndex(libro => libro.ISBN === id);
        
        if (index !== -1) {
            const libroBorrado = inventario[index].titulo;
            inventario.splice(index, 1); // Elimina 1 elemento en la posición index
            console.log(`[ADMIN] Libro eliminado: ${libroBorrado}`);
            return true;
        } else {
            console.warn(`[ADMIN] No se encontró el libro con ISBN: ${id}`);
            return false;
        }
    }

    /**
     * Modifica los atributos de un libro existente.
     * * @param {Libro} libroObjeto - La instancia real del libro a editar en vez de buscar por ID recibimos el objeto Libro directamente
     * @param {string} nuevoTitulo 
     * @param {string} nuevoAutor 
     * @param {string} nuevoGenero 
     */
    editarLibro(libroObjeto, nuevoTitulo, nuevoAutor, nuevoGenero) {
        if (!libroObjeto) {
            console.error("No se proporcionó un libro válido para editar.");
            return;
        }

        // Solo actualizamos si envían datos (validación simple)
        if (nuevoTitulo) libroObjeto.titulo = nuevoTitulo;
        if (nuevoAutor) libroObjeto.autor = nuevoAutor;
        if (nuevoGenero) libroObjeto.genero = nuevoGenero; // Asumiendo que Libro tiene setter para genero

        console.log(`[ADMIN] Libro actualizado: ${libroObjeto.titulo}`);
    }
}