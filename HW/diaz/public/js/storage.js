// Funciones para manejar el almacenamiento en localStorage
function guardarEnStorage(datos, nombreData) {
    if (nombreData === 'usuariosData') {
        localStorage.setItem('usuariosData', JSON.stringify(datos || []));
    } else if (nombreData === 'librosData') {
        localStorage.setItem('librosData', JSON.stringify(datos || []));
    }
}
function guardarSesionUsuario(nombreData, id) {
    sessionStorage.setItem(nombreData, JSON.stringify(id));
}

function cargarSesionUsuario(nombreData) {
    try {
        return JSON.parse(sessionStorage.getItem(nombreData) || 'null');
    } catch (e) {
        return null;
    }
}
function eliminarSesionUsuario(nombreData) {
    sessionStorage.removeItem(nombreData);
}
// Función para cargar estudiantes desde localStorage
function cargarDelStorage(nombreData) {
    var datos = localStorage.getItem(nombreData);
    if (!datos) {
        return [];
    }

    try {
        var parsed = JSON.parse(datos);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('No se pudo leer datos desde storage', e);
        return [];
    }
}
