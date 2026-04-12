function inicializarScriptPerfil() {
    const Nombre = document.getElementById("nombreP");
    const Apellido = document.getElementById("apellidoP");
    const Correo = document.getElementById("correoP");
    const Cedula = document.getElementById("cedulaP");
    const id = document.getElementById("IdUser");

    fetch("Perfil/cargarPerfil.php")
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.error) {
            console.error("Error en la respuesta del servidor:", data.error);
        } else {
            Nombre.value = data.data.Nombre;
            Apellido.value = data.data.Apellido;
            Correo.value = data.data.Correo;
            Cedula.value = data.data.Cedula;
            id.value = data.data.Id;

        }
    })
    .catch(error => console.error("Error en la solicitud fetch:", error));
}


function actualizarUsuario() {
    let id = document.getElementById("IdUser").value;
    let nombre = document.getElementById("nombreP").value.trim();
    let apellido = document.getElementById("apellidoP").value.trim();
    let correo = document.getElementById("correoP").value.trim();
    let cedula = document.getElementById("cedulaP").value.trim();
    let oldPassword = document.getElementById("oldPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let repeatNewPassword = document.getElementById("repeatNewPassword").value;

    if (!id || !nombre || !apellido || !correo || !cedula) {
        alert("Todos los campos son obligatorios");
        return;
    }

    // Validar nueva contraseña si se proporciona
    if (newPassword || oldPassword) {
        if (!oldPassword) {
            alert("Debes ingresar la contraseña actual para cambiar la contraseña.");
            return;
        }
        if (newPassword.length < 6) {
            alert("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (newPassword !== repeatNewPassword) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }
    }

    let formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("correo", correo);
    formData.append("cedula", cedula);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    fetch("Admin/actualizarMiPerfil.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    })
    .then(response => response.text())
    .then(data => {
        if (data.trim() === "success") {
            alert("Usuario actualizado correctamente");
            document.getElementById("nombreUsuario").innerText = nombre + " " + apellido;
        } else {
            alert("Error: " + data);
        }
    })
    .catch(error => console.error("Error en la solicitud AJAX:", error));
}
