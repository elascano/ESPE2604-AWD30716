const TIEMPO_SIMULACION = 30000;
const COSTO_MULTA = 50.00;

function restarDiaAFechaStr(fechaStr) {
    const [dia, mes, año] = fechaStr.split('/').map(Number);
    const fechaObj = new Date(año, mes - 1, dia);
    fechaObj.setDate(fechaObj.getDate() - 1);
    
    const nuevoDia = String(fechaObj.getDate()).padStart(2, '0');
    const nuevoMes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const nuevoAnio = fechaObj.getFullYear();
    
    return `${nuevoDia}/${nuevoMes}/${nuevoAnio}`;
}

function mostrarResumenDiario(htmlContenido, hayMultas) {
    const modalElemento = document.getElementById('modalAvisoDiario');
    
    if (modalElemento) {
        const contenedorLista = modalElemento.querySelector('#listaAvisos');
        const tituloModal = modalElemento.querySelector('.modal-title');
        const contenidoModal = modalElemento.querySelector('.modal-content');

        contenedorLista.innerHTML = htmlContenido;
        
        if (hayMultas) {
            tituloModal.textContent = "🚨 ¡Atención! Reporte de vencimientos";
            contenidoModal.classList.remove('border-warning');
            contenidoModal.classList.add('border-danger');
            tituloModal.classList.remove('text-warning');
            tituloModal.classList.add('text-danger');
        } else {
            tituloModal.textContent = "📅 Reporte Diario";
            contenidoModal.classList.add('border-warning');
            contenidoModal.classList.remove('border-danger');
            tituloModal.classList.add('text-warning');
            tituloModal.classList.remove('text-danger');
        }

        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElemento);
        modalInstance.show();

        setTimeout(() => {
            modalInstance.hide();
        }, 5000);
    }
}

function iniciarSimulacion() {

    setInterval(() => {
        if (typeof reservas === 'undefined' || reservas.length === 0) return;

        let mensajesAcumulados = "";
        let flagMulta = false;

        // Se recorre el array inversamente para no saltarse libros en caso de eliminar alguno
        for (let i = reservas.length - 1; i >= 0; i--) {
            const reserva = reservas[i];

            reserva.fechaReserva = restarDiaAFechaStr(reserva.fechaReserva);

            const diasRestantes = calcularDiasRestantes(reserva.fechaReserva, reserva.diasPrestamo);

            if (diasRestantes <= 0) {
                devolverLibro(i);
                flagMulta = true;
                
                mensajesAcumulados += `
                    <div class="alert alert-danger mb-0 d-flex align-items-center">
                        <span class="fs-4 me-2">🚫</span>
                        <div>
                            <strong>"${reserva.titulo}"</strong> venció.<br>
                            <small>Se devolvió y cobró multa de $${COSTO_MULTA}.</small>
                        </div>
                    </div>`;
                
                mostrarNotificacion(`Multa de $${COSTO_MULTA} aplicada por "${reserva.titulo}"`, 'danger');

            } else {
                let colorClase = "";
                let icono = "";

                if (diasRestantes <= 3) {
                    colorClase = "alert-warning text-dark"; 
                    icono = "⚠️";
                } else {
                    colorClase = "alert border border-success text-white bg-success bg-opacity-25"; 
                    icono = "✅";
                }

                mensajesAcumulados += `
                    <div class="alert ${colorClase} mb-0 p-2 d-flex align-items-center">
                        <span class="me-2">${icono}</span>
                        <span><strong>"${reserva.titulo}"</strong>: Quedan ${diasRestantes} días.</span>
                    </div>`;
            }
        }

        if (mensajesAcumulados !== "") {
            mostrarResumenDiario(mensajesAcumulados, flagMulta);
        }

        actualizarTablaReservas();

    }, TIEMPO_SIMULACION);
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarSimulacion();
});