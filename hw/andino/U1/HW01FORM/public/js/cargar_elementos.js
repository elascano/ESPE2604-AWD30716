// Datos de los libros (con libro_id para diferenciar copias)
const libros = [
    { 
        libro_id: 'LIB001',
        titulo: 'JavaScript: The Good Parts', 
        autor: 'Douglas Crockford', 
        detalles: 'Una guía esencial para dominar JavaScript y evitar sus partes problemáticas.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB001-2',
        titulo: 'JavaScript: The Good Parts', 
        autor: 'Douglas Crockford', 
        detalles: 'Una guía esencial para dominar JavaScript y evitar sus partes problemáticas.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB001-3',
        titulo: 'JavaScript: The Good Parts', 
        autor: 'Douglas Crockford', 
        detalles: 'Una guía esencial para dominar JavaScript y evitar sus partes problemáticas.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB002',
        titulo: 'Diseño de Bases de Datos', 
        autor: 'Carlos Coronel', 
        detalles: 'Fundamentos y aplicaciones prácticas del diseño de bases de datos relacionales.', 
        categoria: 'Base de Datos',
        disponible: true
    },
    { 
        libro_id: 'LIB003',
        titulo: 'Algoritmos en C++', 
        autor: 'Robert Sedgewick', 
        detalles: 'Implementación y análisis de algoritmos fundamentales en programación.', 
        categoria: 'Algoritmos',
        disponible: true
    },
    { 
        libro_id: 'LIB004',
        titulo: 'HTML5 y CSS3', 
        autor: 'Jon Duckett', 
        detalles: 'Diseño y desarrollo web moderno con HTML5 y CSS3.', 
        categoria: 'Diseño Web',
        disponible: true
    },
    { 
        libro_id: 'LIB005',
        titulo: 'Clean Code', 
        autor: 'Robert C. Martin', 
        detalles: 'Técnicas ágiles de desarrollo de software para escribir código limpio.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB005-2',
        titulo: 'Clean Code', 
        autor: 'Robert C. Martin', 
        detalles: 'Técnicas ágiles de desarrollo de software para escribir código limpio.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB006',
        titulo: 'SQL Avanzado', 
        autor: 'Joe Celko', 
        detalles: 'Técnicas avanzadas de SQL para desarrolladores profesionales.', 
        categoria: 'Base de Datos',
        disponible: true
    },
    { 
        libro_id: 'LIB007',
        titulo: 'Estructuras de Datos', 
        autor: 'Mark Allen Weiss', 
        detalles: 'Teoría y práctica de estructuras de datos fundamentales.', 
        categoria: 'Algoritmos',
        disponible: true
    },
    { 
        libro_id: 'LIB008',
        titulo: 'Python para Científicos', 
        autor: 'Alex DeCaria', 
        detalles: 'Aplicaciones de Python en computación científica y análisis de datos.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB009',
        titulo: 'Responsive Web Design', 
        autor: 'Ethan Marcotte', 
        detalles: 'Técnicas modernas para crear sitios web adaptativos y mobile-first.', 
        categoria: 'Diseño Web',
        disponible: true
    },
    { 
        libro_id: 'LIB010',
        titulo: 'MongoDB: The Definitive Guide', 
        autor: 'Shannon Bradshaw', 
        detalles: 'Guía completa sobre bases de datos NoSQL con MongoDB.', 
        categoria: 'Base de Datos',
        disponible: true
    },
    { 
        libro_id: 'LIB011',
        titulo: 'Introduction to Algorithms', 
        autor: 'Thomas H. Cormen', 
        detalles: 'Referencia académica sobre algoritmos clásicos y su complejidad.', 
        categoria: 'Algoritmos',
        disponible: true
    },
    { 
        libro_id: 'LIB012',
        titulo: 'Vue.js 3 Guide', 
        autor: 'Evan You', 
        detalles: 'Desarrollo de aplicaciones web interactivas con Vue.js.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB013',
        titulo: 'Diseño UX/UI Moderno', 
        autor: 'Steve Krug', 
        detalles: 'Principios de usabilidad y diseño de interfaces de usuario.', 
        categoria: 'Diseño Web',
        disponible: true
    },
    { 
        libro_id: 'LIB014',
        titulo: 'Administración de Servidores Linux', 
        autor: 'Evi Nemeth', 
        detalles: 'Gestión profesional de servidores Linux en entornos empresariales.', 
        categoria: 'Programación',
        disponible: true
    },
    { 
        libro_id: 'LIB015',
        titulo: 'Data Science con Python', 
        autor: 'Jake VanderPlas', 
        detalles: 'Análisis y visualización de datos usando Python y librerías especializadas.', 
        categoria: 'Base de Datos',
        disponible: true
    }
];

// Datos de las categorías
const categorias = [];

libros.forEach(libro => {
    if (!categorias.includes(libro.categoria)) {
        categorias.push(libro.categoria);
    }
});

// Función para agrupar libros por sus atributos principales
// Agrupa libros con el mismo título, autor, categoría y detalles
function agruparLibros(listaLibros) {
    const libroAgrupados = {};
    
    listaLibros.forEach(libro => {
        // Crear una clave única basada en los atributos principales
        const clave = `${libro.titulo}|${libro.autor}|${libro.categoria}|${libro.detalles}`;
        
        if (!libroAgrupados[clave]) {
            libroAgrupados[clave] = {
                titulo: libro.titulo,
                autor: libro.autor,
                detalles: libro.detalles,
                categoria: libro.categoria,
                copias: [],
                cantidadDisponible: 0
            };
        }
        
        // Agregar la copia con su libro_id
        libroAgrupados[clave].copias.push({
            libro_id: libro.libro_id,
            disponible: libro.disponible
        });
        
        // Contar disponibles
        if (libro.disponible) {
            libroAgrupados[clave].cantidadDisponible++;
        }
    });
    
    // Convertir a array
    return Object.values(libroAgrupados);
}

// Función para cargar categorías en el select
function cargarSelect() {
    const selectElement = document.getElementById('selectCategoria');
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
    });
}

// Variables de paginación
let paginaActual = 1;
const librosXPagina = 8;
let librosActuales = []; // Para almacenar libros filtrados (agrupados)

// Función para cargar libros como cards
function cargarCards(pagina = 1) {
    const contenedorCards = document.getElementById('gridLibros');
    contenedorCards.innerHTML = '';
    
    // Calcular índices
    const inicio = (pagina - 1) * librosXPagina;
    const fin = inicio + librosXPagina;
    const librosPagina = librosActuales.slice(inicio, fin);
    
    if (librosPagina.length === 0) {
        contenedorCards.innerHTML = '<div class="col-12 text-center text-soft"><p>No se encontraron libros.</p></div>';
        document.getElementById('paginationContainer').innerHTML = '';
        return;
    }
    
    librosPagina.forEach((libro, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        const hayDisponibles = libro.cantidadDisponible > 0;
        const botonDeshabilitado = hayDisponibles ? '' : 'disabled';
        const claseBotón = hayDisponibles ? 'btn-primary' : 'btn-secondary';
        
        col.innerHTML = `
            <div class="glass rounded-3 p-3 h-100 shadow-soft">
                <h5 class="fw-bold mb-2">${libro.titulo}</h5>
                <p class="text-soft small mb-2">📝 ${libro.autor}</p>
                <p class="small mb-3">${libro.detalles}</p>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-primary">${libro.categoria}</span>
                    <span class="badge bg-info text-dark">📚 ${libro.cantidadDisponible} disponibles</span>
                </div>
                <button class="btn btn-sm ${claseBotón} w-100" ${botonDeshabilitado}>
                    ${hayDisponibles ? 'Reservar' : 'Sin disponibles'}
                </button>
            </div>
        `;
        
        contenedorCards.appendChild(col);
    });
    
    // Cargar paginación
    cargarPaginacion();
}

// Función para cargar libros con filtro (desde controlador.js)
function cargarCardsConFiltro(librosFiltrados, pagina = 1) {
    // Agrupar los libros filtrados
    librosActuales = agruparLibros(librosFiltrados);
    paginaActual = 1;
    cargarCards(pagina);
}

// Función para cargar la paginación
function cargarPaginacion() {
    const totalPaginas = Math.ceil(librosActuales.length / librosXPagina);
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';
    
    if (totalPaginas <= 1) return; // No mostrar paginación si hay una sola página
    
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Page navigation');
    
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center pagination-custom';
    
    // Botón anterior
    const liPrev = document.createElement('li');
    liPrev.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liPrev.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1}); return false;">Anterior</a>`;
    ul.appendChild(liPrev);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${i}); return false;">${i}</a>`;
        ul.appendChild(li);
    }
    
    // Botón siguiente
    const liNext = document.createElement('li');
    liNext.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    liNext.innerHTML = `<a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1}); return false;">Siguiente</a>`;
    ul.appendChild(liNext);
    
    nav.appendChild(ul);
    paginationContainer.appendChild(nav);
}

// Función para cambiar de página
function cambiarPagina(pagina) {
    const totalPaginas = Math.ceil(librosActuales.length / librosXPagina);
    if (pagina >= 1 && pagina <= totalPaginas) {
        paginaActual = pagina;
        cargarCards(paginaActual);
        // Scroll al inicio del catálogo
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    }
}

// Cargar elementos al documento
document.addEventListener('DOMContentLoaded', function() {
    cargarSelect();
    librosActuales = agruparLibros(libros);  // Agrupar los libros iniciales
    cargarCards();
});