function inicializarValidacion() {
    const formulario = document.getElementById('formUsuario');
    const inputs = document.querySelectorAll("#formUsuario input");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

    togglePasswordBtn.addEventListener("click", function () {
        const tipo = passwordField.type === "password" ? "text" : "password";
        passwordField.type = tipo;

        toggleIcon.classList.toggle("bi-eye");
        toggleIcon.classList.toggle("bi-eye-slash");
    });

    const expresiones = {
        username: /^[a-zA-Z0-9\_\-]{4,16}$/, 
        nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
        apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
        password: /^.{8,}$/, 
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 
        cedula: /^\d{10}$/
    };

    const campos = {
        nombre: false,
        apellido: false,
        cedula: false,
        password: false,
        email: false
    };

    const validarFormulario = (e) => {
        const input = e.target;
        const nombreCampo = input.name;

        switch (nombreCampo) {
            case "nombre":
            case "apellido":
            case "cedula":
            case "password":
            case "email":
                validarCampo(expresiones[nombreCampo], input, nombreCampo);
                break;
            case "password2":
                validarPassword2();
                break;
        }
    };

    const validarCampo = (expresion, input, campo) => {
        const contenedor = input.closest('.campo-contenedor');
        const mensajeError = contenedor.querySelector('.formulario__input-error');
        if (expresion.test(input.value)) {
            contenedor.classList.remove('formulario__grupo-incorrecto');
            contenedor.classList.add('formulario__grupo-correcto');
            mensajeError.classList.remove('formulario__input-error-activo');
            campos[campo] = true;
        } else {
            contenedor.classList.add('formulario__grupo-incorrecto');
            contenedor.classList.remove('formulario__grupo-correcto');
            mensajeError.classList.add('formulario__input-error-activo');
            campos[campo] = false;
        }
    };

    const validarPassword2 = () => {
        const inputPassword1 = document.getElementById('password');
        const inputPassword2 = document.getElementById('password2');
        const grupoPassword2 = document.getElementById(`grupo__password2`);
        const errorMensaje = document.querySelector(`#grupo__password2 .formulario__input-error`);

        if (inputPassword1.value !== inputPassword2.value) {
            grupoPassword2.classList.add(`formulario__grupo-incorrecto`);
            grupoPassword2.classList.remove(`formulario__grupo-correcto`);
            errorMensaje.classList.add(`formulario__input-error-activo`);
            campos['password'] = false;
        } else {
            grupoPassword2.classList.remove(`formulario__grupo-incorrecto`);
            grupoPassword2.classList.add(`formulario__grupo-correcto`);
            errorMensaje.classList.remove(`formulario__input-error-activo`);
            campos['password'] = true;
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', validarFormulario); 
        input.addEventListener('blur', validarFormulario);  
    });

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const mensajeError = document.getElementById("mensajeError");
        mensajeError.classList.add("d-none");
        mensajeError.innerHTML = "";

        let esValido = Object.values(campos).every(valor => valor);

        if (esValido) {
            formulario.submit();  
            formulario.reset();
            document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
            setTimeout(() => {
                document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
            }, 5000);
            document.querySelectorAll('.formulario__grupo-correcto').forEach(icono => {
                icono.classList.remove('formulario__grupo-correcto');
            });
        } else {
            mensajeError.classList.remove('d-none');
            mensajeError.innerHTML = "Por favor, corrige los campos marcados antes de continuar.";
        }
    });
}

function guardarUsuario(event) {
    event.preventDefault(); 

    let form = document.getElementById("formUsuario");

    const formData = new FormData(form);
    console.log("Datos enviados:", Array.from(formData.entries()));

    fetch("Admin/registrar_usuario.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json()) 
    .then(data => {
        const mensajeError = document.getElementById("mensajeError");
        if (data.success) {
            console.log("Ingreso guardado:", data);
            form.reset();
            cargarPagina('../php/Admin/AdminUserLista.php', 5);
        } else {
            mensajeError.classList.remove("d-none");
            mensajeError.innerHTML = data.error;  // Mostramos el error en la interfaz
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
}
