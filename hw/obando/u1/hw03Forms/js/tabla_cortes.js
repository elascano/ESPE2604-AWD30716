function cargarCitas() {
    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    let tabla = document.getElementById('tablaCitas');
    
    if (citas.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No hay citas registradas aún</td></tr>';
        return;
    }
    
    tabla.innerHTML = '';
    citas.forEach(function(cita) {
        let fila = `<tr>
            <td>${cita.nombre}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${cita.corte}</td>
            <td>${cita.cabello}</td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

window.addEventListener('load', cargarCitas);
