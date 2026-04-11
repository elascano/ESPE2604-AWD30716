
// MODELO DE DATOS
// Actualizado con LocalStorage para persistencia de datos e imágenes.
if (typeof Libro === 'undefined') {
    window.Libro = class Libro {
        static contadorId = 1;
        constructor(titulo, autor, genero, portada) {
            this.id = Libro.contadorId++;
            this.titulo = titulo;
            this.autor = autor;
            this.genero = genero;
            this.portada = portada || 'https://via.placeholder.com/300x450/cccccc/000000?text=Sin+Portada';
            this.disponible = true;
            this.fechaPrestamo = null;
        }
    };
}

if (typeof Biblioteca === 'undefined') {
    window.Biblioteca = {
        // Array principal
        libros: [],

        // CLAVE PARA LOCALSTORAGE
        storageKey: 'biblioteca_virginia_data',

        // 1. INICIALIZAR: Intenta cargar del localStorage, si no hay nada, crea datos base
        inicializar: function () {
            // localStorage.removeItem(this.storageKey); // LIMPIAR DATOS (para pruebas)
            const datosGuardados = localStorage.getItem(this.storageKey);
            var datos = JSON.parse(datosGuardados);
            if (Array.isArray(datos)) {
                // Si existen datos, los convertimos de Texto a Objetos reales
                this.libros = JSON.parse(datosGuardados);
                console.log("Datos cargados desde LocalStorage");
            } else {
                // Si es la primera vez que entran, cargamos datos de prueba
                this.cargarDatosPrueba();
                this.guardarDatos(); // Guardamos estos datos iniciales
                console.log("Carga inicial con datos por defecto");
            }
        },

        // Función auxiliar para guardar en el navegador
        guardarDatos: function () {
            // Convertimos el Array de objetos a un STRING JSON
            const stringDeLibros = JSON.stringify(this.libros);
            localStorage.setItem(this.storageKey, stringDeLibros);
        },

        cargarDatosPrueba: function () {
            this.agregarLibro(new Libro("Cien años de soledad", "Gabriel G. Marquez", "Novela", "https://images.penguinrandomhouse.com/cover/9780307474728"), false);
            this.agregarLibro(new Libro("El Principito", "Antoine de Saint-Exupéry", "Infantil", "https://tse2.mm.bing.net/th/id/OIP.zNEmw5eIZb0py_ccn9smbgHaJd?w=2000&h=2555&rs=1&pid=ImgDetMain&o=7&rm=3"), false);
            this.agregarLibro(new Libro("Clean Code", "Robert C. Martin", "Tecnología", "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg"), false);
            this.agregarLibro(new Libro("La Sombra del Viento", "Carlos Ruiz Zafón", "Misterio", "https://m.media-amazon.com/images/I/51kY5Q3TFhL.jpg"), false);
            this.agregarLibro(new Libro("Don Quijote de la Mancha", "Miguel de Cervantes", "Clásico", "https://m.media-amazon.com/images/I/51A6l6bXJDL._SX331_BO1,204,203,200_.jpg"), false);
            this.agregarLibro(new Libro("El Hobbit", "J.R.R. Tolkien", "Fantasía", "https://m.media-amazon.com/images/I/51EstVXM1UL._SX331_BO1,204,203,200_.jpg"), false);
            this.agregarLibro(new Libro("1984", "George Orwell", "Ciencia Ficción", "https://m.media-amazon.com/images/I/41GD5QJ1YDL._SX324_BO1,204,203,200_.jpg"), false);
        },

        

        // El parámetro 'guardar' es opcional, sirve para no guardar repetidamente en la carga inicial
        agregarLibro: function (nuevoLibro, guardar = true) {
            this.libros.push(nuevoLibro);
            if (guardar) this.guardarDatos();
            return nuevoLibro;
        },

        eliminarLibro: function (id) {
            // Filtramos para quedarnos con todos MENOS el que queremos borrar
            const longitudAnterior = this.libros.length;
            this.libros = this.libros.filter(libro => libro.id !== id);

            if (this.libros.length < longitudAnterior) {
                this.guardarDatos(); // Actualizamos la memoria
                return true;
            }
            return false;
        },

        toggleDisponibilidad: function (id) {
            const libro = this.libros.find(l => l.id === id);
            if (libro) {
                libro.disponible = !libro.disponible;
                libro.fechaPrestamo = libro.disponible ? null : new Date();
                this.guardarDatos(); // Guardar el cambio de estado
                return libro;
            }
            return null;
        }
    };
}

// Arrancamos la lógica solo si no ha sido inicializado
if (window.Biblioteca && !window.Biblioteca._initialized) {
    window.Biblioteca.inicializar();
    window.Biblioteca._initialized = true;
}