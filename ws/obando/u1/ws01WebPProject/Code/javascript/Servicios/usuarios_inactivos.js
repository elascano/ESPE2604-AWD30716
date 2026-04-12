function inicializarScriptUsuarios() {
    cargarUsuarios();

    document.getElementById("toggleInactivos").addEventListener("change", function () {
        cargarUsuarios(this.checked);
    });

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("editar-usuario")) {
            mostrarFormularioEditar(event.target);
        }
    });

    document.getElementById("formEditarUsuario").addEventListener("submit", function (event) {
        event.preventDefault();
        guardarCambiosUsuario();
    });
}

function cargarUsuarios(mostrarInactivos = false) {
    let url = `Admin/ObtenerUsuarios.php?ver_inactivos=${mostrarInactivos ? "1" : "0"}`;

    fetch(url)
        .then(response => response.json())
        .then(usuarios => {
            let tbody = document.getElementById("usuariosTabla");
            tbody.innerHTML = "";

            if (usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    let fila = document.createElement("tr");
                    fila.id = `usuario-${usuario.Cedula}`;
                    fila.innerHTML = `
                        <td>${usuario.Cedula}</td>
                        <td>${usuario.Nombre}</td>
                        <td>${usuario.Apellido}</td>
                        <td>${usuario.Correo}</td>
                        <td>${usuario.Rol}</td>
                        <td>
                            <span class="badge ${usuario.Estado === 'Activo' ? 'bg-success' : 'bg-secondary'}" id="estado-${usuario.Cedula}">
                                ${usuario.Estado}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="mostrarFormularioEditar(${usuario.Id})">
                                Editar
                            </button>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay usuarios registrados</td></tr>';
            }
        })
        .catch(error => console.error("Error cargando usuarios:", error));
}


function mostrarFormularioEditar(id) {
    fetch(`Admin/consultarUsuario.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error); 
            } else {
                // Rellenar el formulario con los datos obtenidos
                document.getElementById("cedulaEditar").value = data.Cedula;
                document.getElementById("rolEditar").value = data.Rol;
                document.getElementById("estadoEditar").value = data.Estado;

                // Obtener el modal y asegurar que tiene aria-hidden en falso
                const modal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));

                // Intentar enfocar un elemento seguro en la página, como el formulario
                const formElement = document.getElementById("formEditarUsuario");
                if (formElement) {
                    formElement.focus();
                } else {
                    console.error('El formulario no se encontró para enfocar');
                }

                // Mostrar el modal
                document.getElementById('editarUsuarioModal').setAttribute('aria-hidden', 'false');
                modal.show();
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
        });
}



function guardarCambiosUsuario() {
    let cedula = document.getElementById("cedulaEditar").value;
    let rol = document.getElementById("rolEditar").value;
    let estado = document.getElementById("estadoEditar").value;

    fetch("Admin/actualizarUsuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `cedula=${cedula}&rol=${rol}&estado=${estado}`
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "success") {
            let fila = document.getElementById(`usuario-${cedula}`);

            if (fila) {
                let badge = fila.querySelector(".badge");
                if (badge) {
                    badge.classList.remove("bg-success", "bg-secondary");
                    badge.classList.add(estado === "Activo" ? "bg-success" : "bg-secondary");
                    badge.innerText = estado;
                }
            } else {
                console.warn("La fila no existe, recargando la lista de usuarios...");
                cargarUsuarios();
            }

            // Cerrar el modal correctamente
            let modalElement = document.getElementById('editarUsuarioModal');
            let modalInstance = bootstrap.Modal.getInstance(modalElement);
            inicializarScriptUsuarios();
            if (modalInstance) {
                modalInstance.hide();
            }

        } else {
            alert("Error al guardar los cambios: " + data);
        }
    })
    .catch(error => console.error("Error en la solicitud AJAX:", error));
}


