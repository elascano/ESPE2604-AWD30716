


let modalActualizarGasto;
let listaEgresos = [];
let listaTiposEgresos = [];
let tablaEgresos;
//Cargar todos los datos de los ingresos en una lista

function abrirAgregarGasto() {
    modalAgregargasto.showModal();
}
function cerrarAgregarGasto() {
    let form = document.getElementById("registrarEgreso");
    form.reset();
    modalAgregargasto.close();

}
function cerrarActualizarGasto() {
    let form = document.getElementById("actualizarGasto");
    form.reset();
    modalActualizarGasto.close();
}
function guardarDatosEgreso(event) {
    // Evitar que se recargue la página
    event.preventDefault();
    let formgasto = document.getElementById("registrarEgreso");
    const formData = new FormData(formgasto);
    console.log("Datos enviados:", Array.from(formData.entries()));

    // Enviar los datos al archivo PHP
    fetch("Gasto/registrarGastos.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json()) // Suponiendo que el PHP devolverá un JSON
        .then(data => {
            // Manejar la respuesta del servidor
            if (data.success) {
                console.log("Ingreso guardado:", data); // O puedes actualizar la UI
                gastoscript();
            } else {
                console.error("Error al guardar el ingreso:", data.error);

            }

        })
        .catch(error => console.error("Error en la solicitud:", error));

}


//Cargar todos los datos de los tipos de ingresos en una lista
function gastoscript() {
    if (!permisos.AgregarGasto) {
        document.getElementById("agregar").style.display = "none";
        document.getElementById("agregar").disabled = true;
    }
    let modalAgregargasto = document.getElementById("modalAgregargasto");
    modalActualizarGasto = document.getElementById("modalActualizarGasto");
    tablaEgresos = document.getElementById("tablaEgresos").getElementsByTagName('tbody')[0];

    console.log(document.title);
    document.title = "Gastos | MIECONOMIA";
    fetch("Gasto/gastosLista.php")
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidoss:", data);
            if (data.error) {

                console.error("Error en la respuesta del servidor:", data.error);

            } else {
                listaEgresos = data;
                cargarEgresos();
                cargarTiposEgresos();

            }
        })

        .catch(error => console.error("Error en la solicitud fetch:", error));


}

async function cargarTiposEgresos() {
    return fetch(`Categoria/tipoEgresoLista.php`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data);
            if (data.error) {

                console.error("Error en la respuesta del servidor:", data.error);

            } else {
                listaTiposEgresos = data;

                cargarTiposFormularioEgreso();
                cerrarAgregarGasto();
            }
        })
        .catch(error => console.error("Error en la solicitud fetch:", error));
}

function cargarTiposFormularioEgreso() {

    let select = document.getElementById("selectTipoEgreso");
    let select1 = document.getElementById("tipoEgresosConsulta");
    let select2 = document.getElementById("selectTipoGastoA");
    let opciones = '<option value="">Seleccione un tipo</option>';

    listaTiposEgresos.forEach(tipo => {
        opciones += `<option value="${tipo.Id}">${tipo.Nombre}</option>`;
    });

    console.log("Tipos de ingreso:", opciones);

    select.innerHTML = opciones;
    select1.innerHTML = opciones;
    select2.innerHTML = opciones;
}

function cargarEgresos() {
    tablaEgresos.innerHTML = "";

    listaEgresos.forEach((ingreso) => {

        let nuevaFila = tablaEgresos.insertRow();
        nuevaFila.classList.add("align-middle");
        let estado = "";

        let editar = "";

        nuevaFila.insertCell(0).innerText = ingreso.Id;
        nuevaFila.insertCell(1).innerText = ingreso.Fecha;
        nuevaFila.insertCell(2).innerHTML = `
        <span class="d-inline-block text-truncate" style="max-width: 150px;" 
            data-bs-toggle="tooltip" data-bs-placement="top" title="${ingreso.Descripcion}">
            ${ingreso.Descripcion}
        </span>`;

        nuevaFila.insertCell(3).innerText = "$ " + ingreso.Monto;
        nuevaFila.insertCell(4).innerText = ingreso.tipo;
        nuevaFila.insertCell(5).innerText = ingreso.Metodo;


        if (ingreso.Estado == "Completado") {
            estado = '<p class="bg-success-subtle text-center m-0 p-0">Completado</p>';
            editar = '<div class="d-flex">';

            if (permisos.AnularActivarGasto) {
                editar += `<i style="color:red;font-size: 25px;" class="bi bi-x-circle mx-2 icono-boton" title="Anular" onclick="cambiarEstadoGasto(${ingreso.Id}, 2)"></i>`;
            }

            if (permisos.EditarGasto) {
                editar += `<i style="color:blue;font-size: 25px;" class="bi bi-pencil-square mx-2 icono-boton" onclick="abrirActualizarGasto(${ingreso.Id})"></i>`;
            }
            editar += '</div>';

        } else if (ingreso.Estado == "Anulado") {
            estado = '<p class="bg-danger-subtle text-center m-0 p-0">Anulado</p>';
            editar = '<div class="d-flex">';

            if (permisos.AnularActivarGasto) {
                editar += `<i style="color:green;font-size: 25px;" class="bi bi-check-circle mx-2 icono-boton" title="Completar" onclick="cambiarEstadoGasto(${ingreso.Id}, 1)"></i>`;
            }

            if (permisos.EditarGasto) {
                editar += `<i style="color:blue;font-size: 25px;" class="bi bi-pencil-square mx-2 icono-boton" onclick="abrirActualizarGasto(${ingreso.Id})"></i>`;
            }
            editar += '</div>';
        }


        nuevaFila.insertCell(6).innerHTML = "" + ingreso.Nombre + " " + ingreso.Apellido;

        let url = "" + ingreso.CodigoQR;

        console.log(url);

        nuevaFila.insertCell(7).innerHTML = `<div class="shadow mx-auto bg-black d-flex justify-content-center align-items-center qr botonQr" onclick="mostrarQR('` + url + `')"></div>`;
        nuevaFila.insertCell(8).innerHTML = estado;
        nuevaFila.insertCell(9).innerHTML = editar;
    });
    let tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltip) => {
        new bootstrap.Tooltip(tooltip);
    });

    renderizarTable();


}


function mostrarQR(imagen) {
    document.getElementById("codigoQr").style.display = "flex";
    document.getElementById("cargarQr").src = imagen;
}

function cerrarQR() {
    document.getElementById("codigoQr").style.display = "none";
}


let itemsPorPaginaGasto = 5;
let actualPaginaGasto = 1;

function renderizarTable() {
    const tableBody = document.getElementById("table-body");

    const rows = tableBody.getElementsByTagName("tr");

    let start = (actualPaginaGasto - 1) * itemsPorPaginaGasto;
    let end = start + itemsPorPaginaGasto;

    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = (i >= start && i < end) ? "" : "none";
    }

    renderizarPagination();

}

function renderizarPagination() {
    const pagination = document.getElementById("paginationGasto");
    pagination.innerHTML = "";
    let totalPages = Math.ceil(listaEgresos.length / itemsPorPaginaGasto);

    pagination.innerHTML += `<li class='page-item ${actualPaginaGasto === 1 ? "disabled" : ""}'>
                                <a class='page-link' href='#' onclick='changePageGasto(${actualPaginaGasto - 1})'>Anterior</a>
                            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<li class='page-item ${actualPaginaGasto === i ? "active" : ""}'>
                                    <a class='page-link' href='#' onclick='changePageGasto(${i})'>${i}</a>
                                </li>`;
    }

    pagination.innerHTML += `<li class='page-item ${actualPaginaGasto === totalPages ? "disabled" : ""}'>
                                <a class='page-link' href='#' onclick='changePageGasto(${actualPaginaGasto + 1})'>Siguiente</a>

                                </li>`;

}

function changePageGasto(page) {
    const totalPages = Math.ceil(listaEgresos.length / itemsPorPaginaGasto);
    if (page < 1 || page > totalPages) return;
    actualPaginaGasto = page;
    renderizarTable();
}

function updateItemsPerPageGasto() {
    itemsPorPaginaGasto = parseInt(document.getElementById("itemsPerPageGasto").value);
    actualPaginaGasto = 1;
    renderizarTable();
}

function actualizarDatosGasto(event) {
    event.preventDefault();

    let form = document.getElementById("actualizarGasto");

    const formData = new FormData(form);
    console.log("Datos enviados para actualizar:", Array.from(formData.entries()));

    fetch("Gasto/actualizarGasto.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Gasto actualizado:", data);
                gastoscript();
                modalActualizarGasto.close();

            } else {
                console.error("Error al actualizar el ingreso:", data.error);
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
}



function abrirActualizarGasto(id) {
    let formData = new FormData();
    formData.append("Id", id);

    fetch("Gasto/buscarEgreso.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error en la consulta:", data.error);
                return;
            }

            if (data.length > 0) {
                const ingreso = data[0];

                console.log(ingreso);

                document.getElementById("idGasto").value = id;
                document.getElementById("selectTipoGastoA").value = ingreso.tipo;
                document.getElementById("metodoGastoA").value = ingreso.Metodo;
                document.getElementById("montoGastoA").value = ingreso.Monto;
                document.getElementById("fechaGastoA").value = ingreso.Fecha;
                document.getElementById("descripcionGastoA").value = ingreso.Descripcion;
                document.querySelector(".codigo").innerHTML = `<img src="${ingreso.CodigoQR}" alt="Código QR" class="img-fluid">`;
                modalActualizarGasto.showModal();
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
}
function cambiarEstadoGasto(id, estado) {
    const url = `Gasto/activarDesactivarGasto.php?Id=${id}&estado=${estado}`;

    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            gastoscript();
        })
        .catch(error => {
            console.error('Error al cambiar el estado:', error);
        });
}
function filtrarDatosGasto() {
    let tipo = document.getElementById("tipoEgresosConsulta").value;
    let fechaInicio = document.getElementById("fechaInicioGasto").value;
    let fechaFin = document.getElementById("fechaFinGasto").value;
    let estado = document.getElementById("EstadoConsultaGasto").value;

    let formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    formData.append("estado", estado);

    fetch("Gasto/filtrarEgreso.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error en la consulta:", data.error);
                return;
            }

            listaEgresos = data;
            cargarEgresos();
        })
        .catch(error => console.error("Error en la solicitud:", error));
}

function actualizarFondoQRGasto(modalId, selectId) {
    let idCategoria = document.querySelector(`#${modalId} #${selectId}`).value;
    
    if (!idCategoria) {
        return; 
    }

    const divQR = document.querySelector(`#${modalId} .codigo`);

    fetch(`Categoria/cargarQR.php?idCategoria=${idCategoria}`)
        .then(response => response.json())
        .then(data => {
            if (data.CodigoQR) {
                divQR.innerHTML = `<img src="${data.CodigoQR}" alt="Código QR" class="img-fluid">`;
            } else {
                divQR.innerHTML = '<p>No se encontró código QR para esta categoría.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener el código QR:', error);
            divQR.innerHTML = '<p>Error al cargar el código QR.</p>';
        });
}