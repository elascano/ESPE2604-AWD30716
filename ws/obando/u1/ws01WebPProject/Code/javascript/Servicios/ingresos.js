let botonAgregar;
let modalAgregar;
let modalActualizar;
let listaIngresos = [];
let listaTiposIngreso = [];
let tablaIngresos;


//Cargar todos los datos de los ingresos en una lista
function inicializarScriptIngresos(){
    if (!permisos.AgregarIngreso) {
        document.getElementById("agregar").style.display= "none";
        document.getElementById("agregar").disabled= true;
    }

    botonAgregar = document.getElementById("agregar");
    modalAgregar = document.getElementById("modalAgregar");
    modalActualizar = document.getElementById("modalActualizar");
    tablaIngresos = document.getElementById("tablaIngresos").getElementsByTagName('tbody')[0];
    console.log(document.title);
    document.title = "Ingresos | MIECONOMIA";

    fetch("Ingreso/ingresosLista.php")
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.error) {
            console.error("Error en la respuesta del servidor:", data.error);
        } else {
            listaIngresos = data;
            cargarIngresos();
            cargarTipos();
        }
    })
    .catch(error => console.error("Error en la solicitud fetch:", error));
}

//Cargar todos los datos de los tipos de ingresos en una lista
async function cargarTipos(){
    return fetch(`Categoria/tipoIngresoLista.php`)
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.error) {
            console.error("Error en la respuesta del servidor:", data.error);
        } else {
            listaTiposIngreso = data;
            cargarTiposFormulario();
            cerrarAgregarIngreso();
        }
    })
    .catch(error => console.error("Error en la solicitud fetch:", error));
}

function cargarTiposFormulario() {
    
    let select = document.getElementById("selectTipo");
    let select1 = document.getElementById("tipoIngresoConsulta");
    let select2 = document.getElementById("selectTipoA");
    let opciones = '<option value="">Seleccione un tipo</option>';

    listaTiposIngreso.forEach(tipo => {
        opciones += `<option value="${tipo.Id}">${tipo.Nombre}</option>`;
    });

    console.log("Tipos de ingreso:", opciones);

    select.innerHTML = opciones;
    select1.innerHTML = opciones;
    select2.innerHTML = opciones;
}


function cargarIngresos() {
    tablaIngresos.innerHTML = ""; 

    listaIngresos.forEach((ingreso) => {

        let nuevaFila = tablaIngresos.insertRow();
        nuevaFila.classList.add("align-middle");
        let estado = "";

        let editar ="";

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


        if(ingreso.Estado == "Completado"){
            estado = '<p class="bg-success-subtle text-center m-0 p-0">Completado</p>';

            editar = '<div class="d-flex">';
            
            if(permisos.AnularActivarIngreso){
                editar += `<i style="color:red;font-size: 25px;" class="bi bi-x-circle mx-2 icono-boton" title="Anular" onclick="cambiarEstado(${ingreso.Id}, 2)"></i>`;
            }

            if(permisos.EditarIngreso){
                editar += `<i style="color:blue;font-size: 25px;" class="bi bi-pencil-square mx-2 icono-boton" onclick="abrirActualizarIngreso(${ingreso.Id})"></i>`;
            }

            editar += '</div>';

        }else if(ingreso.Estado == "Anulado"){
            estado = '<p class="bg-danger-subtle text-center m-0 p-0">Anulado</p>';
            editar = '<div class="d-flex">';

            if(permisos.AnularActivarIngreso){
                editar += `<i style="color:green;font-size: 25px;" class="bi bi-check-circle mx-2 icono-boton" title="Completar" onclick="cambiarEstado(${ingreso.Id}, 1)"></i>`;
            }

            if(permisos.EditarIngreso){
                editar += `<i style="color:blue;font-size: 25px;" class="bi bi-pencil-square mx-2 icono-boton" onclick="abrirActualizarIngreso(${ingreso.Id})"></i>`;
            }

            editar += '</div>';
        }
        

        nuevaFila.insertCell(6).innerHTML = ""+ ingreso.Nombre + " " + ingreso.Apellido;

        let url = ""+ingreso.CodigoQR;

        console.log(url);

        nuevaFila.insertCell(7).innerHTML = `<div class="shadow mx-auto bg-black d-flex justify-content-center align-items-center qr botonQr" onclick="mostrarQR('`+url+`')"></div>`;
        nuevaFila.insertCell(8).innerHTML = estado;
        nuevaFila.insertCell(9).innerHTML = editar;
    });
    let tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltip) => {
        new bootstrap.Tooltip(tooltip);
    });
    renderTable();
}

//Para abrir y cerrar el dialog que permite agregar un nuevo ingreso
function abrirAgregarIngreso() {
    modalAgregar.showModal();
}

function abrirActualizarIngreso(id) {
    let formData = new FormData();
    formData.append("Id", id);

    fetch("Ingreso/buscarIngreso.php", {
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

            document.getElementById("idIngreso").value = id;
            document.getElementById("selectTipoA").value = ingreso.tipo; 
            document.getElementById("metodoIngresoA").value = ingreso.Metodo; 
            document.getElementById("montoIngresoA").value = ingreso.Monto; 
            document.getElementById("fechaIngresoA").value = ingreso.Fecha; 
            document.getElementById("descripcionIngresoA").value = ingreso.Descripcion; 
            document.querySelector(".codigo").innerHTML = `<img src="${ingreso.CodigoQR}" alt="Código QR" class="img-fluid">`; 

            modalActualizar.showModal();
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
}


function cerrarAgregarIngreso(){
    let form = document.getElementById("registrarIngreso");
    form.reset();
    modalAgregar.close();
}

function cerrarActualizarIngreso(){
    let form = document.getElementById("actualizarIngreso");
    form.reset();
    modalActualizar.close();
}


//Permite llamar al archivo php que realiza el ingreso de los datos en MYSQL
function guardarDatos(event) {
    event.preventDefault(); 

    let form = document.getElementById("registrarIngreso");

    const formData = new FormData(form);
    console.log("Datos enviados:", Array.from(formData.entries()));

    fetch("Ingreso/registrarIngreso.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success) {
            console.log("Ingreso guardado:", data);
            inicializarScriptIngresos();
        } else {
            console.error("Error al guardar el ingreso:", data.error);
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
}

//Permite llamar al archivo php que realiza la actualización de los datos en MYSQL
function actualizarDatos(event) {
    event.preventDefault(); 

    let form = document.getElementById("actualizarIngreso"); 

    const formData = new FormData(form); 
    console.log("Datos enviados para actualizar:", Array.from(formData.entries()));

    fetch("Ingreso/actualizarIngreso.php", {
        method: "POST", 
        body: formData 
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success) {
            console.log("Ingreso actualizado:", data); 
            modalActualizar.close(); 
            inicializarScriptIngresos(); 
        } else {
            console.error("Error al actualizar el ingreso:", data.error); 
        }
    })
    .catch(error => console.error("Error en la solicitud:", error)); 
}


function mostrarQR(imagen) {
    document.getElementById("codigoQr").style.display = "flex";
    document.getElementById("cargarQr").src=imagen;
}

function cerrarQR() {
    document.getElementById("codigoQr").style.display = "none";
}

//para la paginación
let itemsPerPage = 5;
let currentPage = 1;

function renderTable() {
    const tableBody = document.getElementById("table-body");
    const rows = tableBody.getElementsByTagName("tr");
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = (i >= start && i < end) ? "" : "none";
    }
    
    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    let totalPages = Math.ceil(listaIngresos.length / itemsPerPage);
    
    pagination.innerHTML += `<li class='page-item ${currentPage === 1 ? "disabled" : ""}'>
                                <a class='page-link' href='#' onclick='changePage(${currentPage - 1})'>Anterior</a>
                            </li>`;
    
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<li class='page-item ${currentPage === i ? "active" : ""}'>
                                    <a class='page-link' href='#' onclick='changePage(${i})'>${i}</a>
                                </li>`;
    }
    
    pagination.innerHTML += `<li class='page-item ${currentPage === totalPages ? "disabled" : ""}'>
                                <a class='page-link' href='#' onclick='changePage(${currentPage + 1})'>Siguiente</a>
                            </li>`;
}

function changePage(page) {
    const totalPages = Math.ceil(listaIngresos.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

function updateItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById("itemsPerPage").value);
    currentPage = 1;
    renderTable();
}

//Función que permitirá actualizar el estado,e s decir de Completado a Anulado o viceversa
function cambiarEstado(id, estado) {
    const url = `Ingreso/activarDesactivarIngreso.php?Id=${id}&estado=${estado}`;

    fetch(url)
        .then(response => response.text())  
        .then(data => {
            console.log(data);  
            inicializarScriptIngresos();
        })
        .catch(error => {
            console.error('Error al cambiar el estado:', error);
        });
}


function filtrarDatos() {
    let tipo = document.getElementById("tipoIngresoConsulta").value; 
    let fechaInicio = document.getElementById("fechaInicio").value;
    let fechaFin = document.getElementById("fechaFin").value;
    let estado = document.getElementById("EstadoConsulta").value;

    let formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    formData.append("estado", estado);

    fetch("Ingreso/filtrarIngreso.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.error) {
            console.error("Error en la consulta:", data.error);
            return;
        }

        listaIngresos = data; 
        cargarIngresos(); 
    })
    .catch(error => console.error("Error en la solicitud:", error));
}

function actualizarFondoQRIngreso(modalId, selectId) {
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
