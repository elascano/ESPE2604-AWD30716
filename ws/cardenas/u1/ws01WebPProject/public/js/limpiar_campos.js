// Este archivo maneja la lógica del botón Limpiar
// Usa las variables globales definidas en controlador.js y cargar_elementos.js

// Evento para el botón Limpiar
document.getElementById("btnLimpiar").addEventListener("click", () => {
    // Mostrar spinner en el área de cards (usa la función global)
    mostrarSpinner();
    
    // Limpiar campos (usa las variables globales)
    txtBuscar.value = "";
    selectCategoria.value = "todas";
    
    // Limpiar timeout anterior (usa la variable global)
    clearTimeout(delayTime);
    
    // Establecer nuevo timeout de 3 segundos
    delayTime = setTimeout(() => {
        paginaActual = 1;
        librosActuales = agruparLibros(libros); // Reiniciar a todos los libros agrupados
        cargarCards(1);
        txtBuscar.focus();
    }, 3000);
});


