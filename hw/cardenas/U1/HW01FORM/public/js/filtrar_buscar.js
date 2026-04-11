const txtBuscar = document.getElementById("txtBuscar");
const selectCategoria = document.getElementById("selectCategoria");
const gridLibros = document.getElementById("gridLibros");

let delayTime; // Para controlar el debounce

// Función para mostrar spinner en el área de cards
function mostrarSpinner() {
    gridLibros.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Buscando...</span>
            </div>
            <p class="text-soft mt-3">Buscando libros...</p>
        </div>
    `;
}

// Función para filtrar libros
function filtrarLibros() {
    const q = (txtBuscar.value || "").trim().toLowerCase();
    const cat = selectCategoria.value;
    
    // Filtrar libros según búsqueda y categoría
    let librosFiltrados = libros.filter(libro => {
        const coincideTexto = !q || 
            libro.titulo.toLowerCase().includes(q) || 
            libro.autor.toLowerCase().includes(q) || 
            libro.detalles.toLowerCase().includes(q);
        
        const coincideCategoria = cat === "todas" || libro.categoria === cat;
        
        return coincideTexto && coincideCategoria;
    });
    
    // Reiniciar paginación y mostrar resultados filtrados
    paginaActual = 1;
    cargarCardsConFiltro(librosFiltrados);
}

// Debounce para el campo de búsqueda (3 segundos)
txtBuscar.addEventListener("input", () => {
    // Mostrar spinner en el área de cards
    mostrarSpinner();
    
    // Limpiar timeout anterior
    clearTimeout(delayTime);
    
    // Establecer nuevo timeout de 3 segundos
    delayTime = setTimeout(() => {
        filtrarLibros();
    }, 3000);
});

// Evento con delay para el select de categorías (3 segundos)
selectCategoria.addEventListener("change", () => {
    // Mostrar spinner en el área de cards
    mostrarSpinner();
    
    // Limpiar timeout anterior
    clearTimeout(delayTime);
    
    // Establecer nuevo timeout de 3 segundos
    delayTime = setTimeout(() => {
        filtrarLibros();
    }, 3000);
});
