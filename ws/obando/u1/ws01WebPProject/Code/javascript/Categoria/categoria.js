let listaCategoria=[];
let listaTiposCategoria = [];
let tablaCategoria;
let modalAgregarCategoria;
let modalActualizarCategoria;







function guardarDatosCategoria(event) {
    event.preventDefault(); // Evita que el formulario recargue la página
    let formCategoria = document.getElementById("formCategoria");
    let formData = new FormData(formCategoria); // Obtiene los datos del formulario
   
    fetch("Categoria/registrarCategoria.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json()) // Cambia a .json() si el servidor devuelve JSON
    .then(data => {
        if (data.success) {
            // Muestra un mensaje de éxito en la misma página
            alert("Dato correctamente ingresado: " + data.message);
            categoriasScript();
        } else {
            // Muestra un mensaje de error en la misma página
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al enviar el formulario.");
    });
};

function categoriasScript(){
    if (!permisos.AgregarCategoria) {
        document.getElementById("agregar").style.display= "none";
        document.getElementById("agregar").disabled= true;
    }

    tipoCategoria  = document.getElementById("tipoCategoria");
    imagenCategoria = document.getElementById("imagenCategoria");
    modalAgregarCategoria = document.getElementById("modalAgregarCategoria");
    modalActualizarCategoria= document.getElementById("modalActualizarCategoria");
    tablaCategoria  = document.getElementById("tablaCategoria").getElementsByTagName('tbody')[0];
    console.log(document.title);
    document.title = "Categoria | MIECONOMIA";
    fetch("Categoria/listaCategoria.php")
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.error) {
            console.error("Error en la respuesta del servidor:", data.error);
        } else {
            listaCategoria= data;
            cargarCategorias();
        }
    })
    .catch(error => console.error("Error en la solicitud fetch:", error));



}

function abrirAgregarCategoria() {
    modalAgregarCategoria.showModal();
}
function cerrarAgregarCategoria(){
    let form = document.getElementById("formCategoria");
    form.reset();
    modalAgregarCategoria.close();

}

function cargarCategorias() {
    tablaCategoria.innerHTML = ""; 

    listaCategoria.forEach((categoria) => {

        let nuevaFila = tablaCategoria.insertRow();
        nuevaFila.classList.add("align-middle");
 
        let editar ="";

        if(permisos.EditarCategoria){
            editar += `"<i style="color:blue;font-size: 25px;" class="bi bi-pencil-square mx-2 icono-boton" onclick="abrirActualizarCategoria(${categoria.Id})"></i>"`;
        }

        nuevaFila.insertCell(0).innerHTML = categoria.Nombre;

        let url = ""+categoria.CodigoQR;

        console.log(url);
        nuevaFila.insertCell(1).innerHTML = categoria.tipo;
        nuevaFila.insertCell(2).innerHTML = `<div class="shadow mx-auto bg-black d-flex justify-content-center align-items-center qr botonQr" onclick="mostrarQR('`+url+`')"></div>`;
        
        nuevaFila.insertCell(3).innerHTML = editar;
    });
    let tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltip) => {
        new bootstrap.Tooltip(tooltip);
    });
    
    renderTableCategoria();
}
let itemsPerPageCategoria = 5;
let currentPageCategoria = 1;
function renderTableCategoria() {
    
    const tableBody = document.getElementById("tablebodyCategoria");
    if (!tableBody) {
        alert("Error: el elemento tablebodyCategoria no se encuentra.");
        return;
    }
    
    const rows = tableBody.getElementsByTagName("tr");
    let start = (currentPageCategoria - 1) * itemsPerPageCategoria;
    let end = start + itemsPerPageCategoria;
    
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = (i >= start && i < end) ? "" : "none";
    }
    
    renderPaginationCategoria();
}
function mostrarQR(imagen) {
    document.getElementById("codigoQr").style.display = "flex";
    document.getElementById("cargarQr").src=imagen;
}

function cerrarQR() {
    document.getElementById("codigoQr").style.display = "none";
}
function renderPaginationCategoria() {
    const pagination = document.getElementById("paginationCategoria");
    pagination.innerHTML = "";
    let totalPages = Math.ceil(listaCategoria.length / itemsPerPageCategoria);
    
    pagination.innerHTML += `<li class='page-item ${currentPageCategoria === 1 ? "disabled" : ""}'>
                                <a class='page-link' href='#' onclick='changePageCategoria(${currentPageCategoria - 1})'>Anterior</a>
                            </li>`;
    
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<li class='page-item ${currentPageCategoria === i ? "active" : ""}'>
                                    <a class='page-link' href='#' onclick='changePageCategoria(${i})'>${i}</a>
                                </li>`;
    }
    
    pagination.innerHTML += `<li class='page-item ${currentPageCategoria === totalPages ? "disabled" : ""}'>
                                <a class='page-link' href='#' onclick='changePageCategoria(${currentPageCategoria + 1})'>Siguiente</a>
                            </li>`;
}

function changePageCategoria(page) {
    const totalPages = Math.ceil(listaCategoria.length / itemsPerPageCategoria);
    if (page < 1 || page > totalPages) return;
    currentPageCategoria = page;
    renderTableCategoria();
}

function updateItemsPerPageCategoria() {
    itemsPerPageCategoria = parseInt(document.getElementById("itemsPerPageCategoria").value);
    currentPageCategoria = 1;
    renderTableCategoria();
}
function abrirActualizarCategoria(id){

    
    let formData = new FormData();
    formData.append("Id", id);

    fetch("Categoria/buscarCategoria.php", {
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
            const categoria = data[0];

            console.log(categoria);

           
            document.getElementById("ncategoriaA").value = categoria.Nombre; 
            document.getElementById("tipoCategoriaA").value = categoria.tipo;
            document.getElementById("ncategoriaid").value = categoria.Id;  
            
            


            modalActualizarCategoria.showModal();
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));

}

function cerrarActualizarCategoria(){
    let form = document.getElementById("actualizarCategoria");
    var imagenCampo = document.getElementById("CampoImagenCategoria");
    imagenCampo.style.display = "none";
    form.reset();
    modalActualizarCategoria.close();

}

function mostrarCategoriaImagen(){

 
        var checkBox = document.getElementById("opcionImagenCategoria");
        var imagenCampo = document.getElementById("CampoImagenCategoria");

        // Si el checkbox está marcado, mostramos el campo de imagen
        if (checkBox.checked) {
            imagenCampo.style.display = "block";
        } else {
            imagenCampo.style.display = "none";
        }
    

}
function actualizarDatosCategoria(event){

    event.preventDefault(); 

    let form = document.getElementById("actualizarCategoria"); 

    const formData = new FormData(form); 
    console.log("Datos enviados para actualizar:", Array.from(formData.entries()));

    fetch("Categoria/actualizarCategoria.php", {
        method: "POST", 
        body: formData 
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success) {
            console.log("Categoria actualizada:", data); 
            modalActualizarCategoria.close(); 
            categoriasScript();
            
        } else {
            console.error("Error al actualizar el ingreso:", data.error); 
        }
    })
    .catch(error => console.error("Error en la solicitud:", error)); 

}