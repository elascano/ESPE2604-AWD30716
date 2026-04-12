function inicializarScriptPerfiles(){
    cargarPerfiles();
}

function abrirAgregarPerfil() {
    let modalAgregarPerfil = document.getElementById("modalAgregarPerfiles");

    modalAgregarPerfil.showModal();
}

function cerrarAgregarPerfil() {
    let modalAgregarPerfil = document.getElementById("modalAgregarPerfiles");

    modalAgregarPerfil.close();
}

function abrirActualizarPerfil() {
    let modalActualizarPerfil = document.getElementById("modalActualizarPerfil");

    modalActualizarPerfil.showModal();
}

function cerrarActualizarPerfil() {
    let modalActualizarPerfil = document.getElementById("modalActualizarPerfil");

    modalActualizarPerfil.close();
}


function controlarCheckbox(){
    manejarCheckboxPagina("paginaIngresos", ["agregarIngresos", "anularIngresos", "editarIngresos"]);
    manejarCheckboxPagina("paginaGastos", ["agregarGastos", "anularGastos", "editarGastos"]);
    manejarCheckboxPagina("paginaCategorias", ["agregarCategoria", "editarCategoria"]);
    manejarCheckboxPagina("paginaUsuarios", ["crearUsuarios", "desactivarUsuarios", "crearRoles"]);
}


function manejarCheckboxPagina(paginaId, subpermisosIds) {
    const paginaCheckbox = document.getElementById(paginaId);

    subpermisosIds.forEach(subpermisoId => {
        const subpermisoCheckbox = document.getElementById(subpermisoId);

        paginaCheckbox.addEventListener("change", function () {
            if (!paginaCheckbox.checked) {
                subpermisoCheckbox.checked = false;
            }
        });

        subpermisoCheckbox.addEventListener("change", function () {
            if (subpermisoCheckbox.checked) {
                paginaCheckbox.checked = true;
            }
        });
    });
}

function cargarPerfiles() {
    fetch("Admin/AdminPerfilesLista.php")
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById("perfilTableBody");
            tbody.innerHTML = ""; 

            data.forEach(perfil => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${perfil.Nombre}</td>
                    <td>${perfil.Descripcion}</td>
                    <td>
                        <button class="btn bg-info-subtle btn-sm" onclick="verPermisos(${perfil.Id})"><i class="bi bi-shield-lock"></i> Ver Permisos</button>
                    </td>
                    <td>
                        <i style="color:blue;font-size: 25px;" class="bi bi-pencil-square mx-2 icono-boton" onclick="editarPerfil(${perfil.Id})"></i>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error al cargar los perfiles:", error));
}

function verPermisos(idPerfil) {
    fetch("Admin/AdminPerfilesLista.php")
        .then(response => response.json())
        .then(data => {
            let perfil = data.find(p => p.Id == idPerfil);
            if (!perfil) return;

            const permisos = {
                PaginaIngresos: "Página de Ingresos",
                AgregarIngreso: "Agregar Ingreso",
                AnularActivarIngreso: "Anular/Activar Ingreso",
                EditarIngreso: "Editar Ingreso",
                PaginaReportes: "Página de Reportes",
                PaginaGastos: "Página de Gastos",
                AgregarGasto: "Agregar Gasto",
                AnularActivarGasto: "Anular/Activar Gasto",
                EditarGasto: "Editar Gasto",
                PaginaCategorias: "Página de Categorías",
                AgregarCategoria: "Agregar Categoría",
                EditarCategoria: "Editar Categoría",
                PaginaUsuario: "Página de Usuarios",
                CrearUsuario: "Crear Usuario",
                ActivarDesactivarUsuario: "Activar/Desactivar Usuario",
                CrearRol: "Crear Rol",
                PaginaAuditoria: "Pagina de Auditoria"
            };

            let permisosContainer = document.getElementById("listaPermisos");
            permisosContainer.innerHTML = ""; 

            Object.keys(permisos).forEach(key => {
                if (perfil[key] == 1) {
                    let div = document.createElement("div");
                    div.classList.add("form-check");
                    div.innerHTML = `
                        <input class="form-check-input" type="checkbox" id="${key}" checked disabled>
                        <label class="form-check-label" for="${key}">${permisos[key]}</label>
                    `;
                    permisosContainer.appendChild(div);
                }
            });

            let modal = new bootstrap.Modal(document.getElementById("modalVerPermisos"));
            modal.show();
        })
        .catch(error => console.error("Error al cargar permisos:", error));
}

function guardarPerfilNuevo(event) {
    event.preventDefault();

    const perfilData = {
        nombreRol: document.getElementById("nombreRol").value,
        descripcionRol: document.getElementById("descripcionRol").value,
        paginaIngresos: document.getElementById("paginaIngresos").checked ? 1 : 0,
        agregarIngresos: document.getElementById("agregarIngresos").checked ? 1 : 0,
        anularIngresos: document.getElementById("anularIngresos").checked ? 1 : 0,
        editarIngresos: document.getElementById("editarIngresos").checked ? 1 : 0,
        generarReportes: document.getElementById("generarReportes").checked ? 1 : 0,
        paginaGastos: document.getElementById("paginaGastos").checked ? 1 : 0,
        agregarGastos: document.getElementById("agregarGastos").checked ? 1 : 0,
        anularGastos: document.getElementById("anularGastos").checked ? 1 : 0,
        editarGastos: document.getElementById("editarGastos").checked ? 1 : 0,
        paginaCategorias: document.getElementById("paginaCategorias").checked ? 1 : 0,
        agregarCategoria: document.getElementById("agregarCategoria").checked ? 1 : 0,
        editarCategoria: document.getElementById("editarCategoria").checked ? 1 : 0,
        paginaUsuarios: document.getElementById("paginaUsuarios").checked ? 1 : 0,
        crearUsuarios: document.getElementById("crearUsuarios").checked ? 1 : 0,
        desactivarUsuarios: document.getElementById("desactivarUsuarios").checked ? 1 : 0,
        crearRoles: document.getElementById("crearRoles").checked ? 1 : 0,
        paginaAuditoria: document.getElementById("paginaAuditoria").checked ? 1 : 0
    };


    fetch("Admin/AdminPerfilCrear.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfilData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("perfilForm").reset();
            cargarPerfiles();
            cerrarAgregarPerfil(); 
        } else {
            alert("Error al guardar el perfil: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}


function editarPerfil(idPerfil) {
    fetch(`Admin/CargarPerfil.php?id=${idPerfil}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  

            if (data.error) {
                console.error("Error: ", data.error);  
                return;
            }

            const perfil = data[0]; 

            document.getElementById("idPerfil").value= idPerfil;
            document.getElementById("nombreRolActualizar").value = perfil.Nombre;
            document.getElementById("descripcionRolActualizar").value = perfil.Descripcion;

            document.getElementById("paginaIngresosActualizar").checked = perfil.PaginaIngresos == 1;
            document.getElementById("agregarIngresosActualizar").checked = perfil.AgregarIngreso == 1;
            document.getElementById("anularIngresosActualizar").checked = perfil.AnularActivarIngreso == 1;
            document.getElementById("editarIngresosActualizar").checked = perfil.EditarIngreso == 1;

            document.getElementById("generarReportesActualizar").checked = perfil.PaginaReportes == 1;

            document.getElementById("paginaGastosActualizar").checked = perfil.PaginaGastos == 1;
            document.getElementById("agregarGastosActualizar").checked = perfil.AgregarGasto == 1;
            document.getElementById("anularGastosActualizar").checked = perfil.AnularActivarGasto == 1;
            document.getElementById("editarGastosActualizar").checked = perfil.EditarGasto == 1;

            document.getElementById("paginaCategoriasActualizar").checked = perfil.PaginaCategorias == 1;
            document.getElementById("agregarCategoriaActualizar").checked = perfil.AgregarCategoria == 1;
            document.getElementById("editarCategoriaActualizar").checked = perfil.EditarCategoria == 1;

            document.getElementById("paginaUsuariosActualizar").checked = perfil.PaginaUsuario == 1;
            document.getElementById("crearUsuariosActualizar").checked = perfil.CrearUsuario == 1;
            document.getElementById("desactivarUsuariosActualizar").checked = perfil.ActivarDesactivarUsuario == 1;
            document.getElementById("crearRolesActualizar").checked = perfil.CrearRol == 1;
            document.getElementById("paginaAuditoriaActualizar").checked = perfil.PaginaAuditoria == 1;

            abrirActualizarPerfil();
            
        })
        .catch(error => console.error("Error al cargar perfil:", error));
}

function actualizarPerfil(event) {
    event.preventDefault();

    const idPerfil = Number(document.getElementById("idPerfil").value);
    const nombreRol = document.getElementById("nombreRolActualizar").value;
    const descripcionRol = document.getElementById("descripcionRolActualizar").value;

    const permisos = {
        paginaIngresos: document.getElementById("paginaIngresosActualizar").checked ? 1 : 0,
        agregarIngresos: document.getElementById("agregarIngresosActualizar").checked ? 1 : 0,
        anularIngresos: document.getElementById("anularIngresosActualizar").checked ? 1 : 0,
        editarIngresos: document.getElementById("editarIngresosActualizar").checked ? 1 : 0,
        generarReportes: document.getElementById("generarReportesActualizar").checked ? 1 : 0,
        paginaGastos: document.getElementById("paginaGastosActualizar").checked ? 1 : 0,
        agregarGastos: document.getElementById("agregarGastosActualizar").checked ? 1 : 0,
        anularGastos: document.getElementById("anularGastosActualizar").checked ? 1 : 0,
        editarGastos: document.getElementById("editarGastosActualizar").checked ? 1 : 0,
        paginaCategorias: document.getElementById("paginaCategoriasActualizar").checked ? 1 : 0,
        agregarCategoria: document.getElementById("agregarCategoriaActualizar").checked ? 1 : 0,
        editarCategoria: document.getElementById("editarCategoriaActualizar").checked ? 1 : 0,
        paginaUsuarios: document.getElementById("paginaUsuariosActualizar").checked ? 1 : 0,
        crearUsuarios: document.getElementById("crearUsuariosActualizar").checked ? 1 : 0,
        desactivarUsuarios: document.getElementById("desactivarUsuariosActualizar").checked ? 1 : 0,
        crearRoles: document.getElementById("crearRolesActualizar").checked ? 1 : 0,
        paginaAuditoria: document.getElementById("paginaAuditoriaActualizar").checked ? 1 : 0
    };
    
    

    console.log("idPerfil:", idPerfil);
console.log("nombreRol:", nombreRol);
console.log("descripcionRol:", descripcionRol);
console.log("permisos:", permisos);


    const formData = new FormData();
    formData.append("idPerfil", idPerfil);
    formData.append("nombreRol", nombreRol);
    formData.append("descripcionRol", descripcionRol);

    for (const [key, value] of Object.entries(permisos)) {
        formData.append(key, value ? 1 : 0); 
    }

    fetch('Admin/ActualizarPerfil.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        cargarPerfiles();
        document.getElementById("modalActualizarPerfil").close(); 
    })
    .catch(error => console.error('Error al actualizar perfil:', error));
}








