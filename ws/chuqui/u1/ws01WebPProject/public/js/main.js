var usuarios = [];

const usuario = (nombre_completo, apellido_completo, correo_electronico, nombre_usuario, contrasena) => {
    return {
        nombre_completo,
        apellido_completo,
        correo_electronico,
        nombre_usuario,
        contrasena,
        informacion: function () {
            return `Nombre Completo: ${this.nombre_completo} ${this.apellido_completo}, Correo Electrónico: ${this.correo_electronico}, Nombre de Usuario: ${this.nombre_usuario}, Contraseña: ${this.contrasena}`;
        }
    }
}

function inicializar() {
    usuarios = cargarDelStorage('usuariosData');
}

async function registroUsuario() {
    const nombreCompleto = getById('nombreCompleto');
    const apellidoCompleto = getById('apellidoCompleto');
    const correoElectronico = getById('correoElectronico');
    const nombreUsuario = getById('nombreUsuario');
    const contrasena = getById('contrasena');
    const confirmarContrasena = getById('confirmarContrasena');
    const terminosCondiciones = getById('terminosCondiciones').checked;
    if (!validarBotonUsuario(nombreCompleto, apellidoCompleto, correoElectronico, nombreUsuario, contrasena, confirmarContrasena)) {
        return;
    } else if (!terminosCondiciones) {
        return;
    }
    const validarEnTiempoReal = await validarDuplicados(correoElectronico, nombreUsuario, usuarios);
    if (!validarEnTiempoReal) {
        return;
    }
    const nuevo_usuario = usuario(nombreCompleto.value, apellidoCompleto.value, correoElectronico.value, nombreUsuario.value, contrasena.value);
    usuarios.push(nuevo_usuario);
    guardarEnStorage(usuarios, 'usuariosData');
    console.log('Usuario registrado:', nuevo_usuario.informacion());
    mostrarAlertaBasica('¡Registro exitoso!', 'Usuario registrado exitosamente.', 'success').then(() => {
        window.location.href = "login.html";
    });
}

function entradaInicioSesion(usuarioEncontrado, email) {
    let entradaNombreCompleto = document.getElementById('entradaNombreCompleto');
    let entradaEmail = document.getElementById('entradaEmail');
    let primerNombre = usuarioEncontrado.nombre_completo.split(" ")[0];
    let primerApellido = usuarioEncontrado.apellido_completo.split(" ")[0];
    entradaNombreCompleto.textContent = `${primerNombre} ${primerApellido}`;
    entradaEmail.textContent = email;
}

function registroIniciarSesion() {
    const nombreUsuario = getById('inicioUsuario');
    const contrasena = getById('contraseña');
    if (!validarBotonInicioSesion(nombreUsuario, contrasena)) {
        return;
    }
    // Depuración sin .informacion()
    usuarios.forEach((v, index) => {
        console.log(`Usuario ${index + 1}:`, v);
    });
    const usuarioEncontrado = usuarios.find(user => user.nombre_usuario === nombreUsuario.value && user.contrasena === contrasena.value);

    if (usuarioEncontrado) {
        guardarSesionUsuario('currentUserId', usuarioEncontrado.nombre_usuario);
        console.log('Inicio de sesión exitoso:', usuarioEncontrado);
        mostrarAlertaBasica('¡Bienvenido!', 'Inicio de sesión exitoso.', 'success').then(() => {
            window.location.href = "../index.html";
        });
    } else {
        console.log('Credenciales inválidas.');
        mostrarAlertaBasica('Error', 'Credenciales inválidas.', 'error');
    }
}

function manejoCerradura(show) {
    if (show) {
        searchForm?.classList.remove('d-none', 'hide');
        searchForm?.classList.add('show');
        searchToggle?.classList.add('d-none');
        setTimeout(() => searchInput?.focus(), 300);
    } else {
        searchForm?.classList.remove('show');
        searchForm?.classList.add('hide');
        searchToggle?.classList.remove('d-none');
        setTimeout(() => {
            searchForm?.classList.add('d-none');
            searchForm?.classList.remove('hide');
        }, 300);
    }
}

function manejoCerrarAbrirBuscador(searchToggle, searchForm, searchInput, closeSearch) {
    searchToggle?.addEventListener('click', function () {
        manejoCerradura(true);
    });
    closeSearch?.addEventListener('click', () => {
        manejoCerradura(false);
    });
    document.addEventListener('click', (e) => {
        if (searchForm && searchToggle &&
            !searchForm.contains(e.target) &&
            !searchToggle.contains(e.target) &&
            !searchForm.classList.contains('d-none')) {
            manejoCerradura(false);
        }
    });

}

function manejoItem(show, item) {
    if (show) {
        item.classList.add('show');
    } else {
        item.classList.remove('show');
    }
}

function manejoCerrarAbrirItem(toggle, item) {
    toggle?.addEventListener('click', function () {
        if (!item.classList.contains('show')) {
            manejoItem(false, item);
        }
    });
    document.addEventListener('click', (e) => {
        if (item && toggle &&
            !item.contains(e.target) && !toggle.contains(e.target) &&
            item.classList.contains('show')) {
            manejoItem(false, item);
            toggle.classList.remove('show');
        }
    });
}

function activityItems(items, tooltips) {
    if (!items || items.length === 0) return;

    items.forEach(item => {
        item.addEventListener('click', function () {
            items.forEach(li => li.classList.remove('active'));
            this.classList.add('active');

            const anyActive = Array.from(items).some(li => li.classList.contains('active'));
            actualizarTooltips(anyActive, tooltips);
        });
    });
}
// Inicializar tooltips (solo si existen)
function activityMenssage(tooltips) {
    if (!tooltips || tooltips.length === 0) return;

    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function () {
            if (!this._tooltipInstance) {
                this._tooltipInstance = new bootstrap.Tooltip(this);
            }
        });
    });
}

function actualizarTooltips(anyActive, tooltips) {
    if (!tooltips || tooltips.length === 0) return;

    tooltips.forEach(selection => {
        if (anyActive) {
            selection._tooltipInstance?.hide();
        } else {
            if (!selection._tooltipInstance) {
                selection._tooltipInstance = new bootstrap.Tooltip(selection);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    inicializar();
    // var menuItems = document.querySelectorAll('nav.page-navigation li');
    // menuItems.forEach(item => {
    //     item.addEventListener('click', function () {
    //         menuItems.forEach(li => li.classList.remove('active'));
    //         this.classList.add('active');
    //     });
    // });
    const selectTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const selectDropdown = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    const menuItems = document.querySelectorAll('nav.page-navigation ul.nav li a.nav-link');
    const menuItemsBookshop = document.querySelectorAll('nav.navbar div.container-fluid ul.navbar-nav li a.nav-link');
    activityItems(menuItems, selectTooltips);
    activityItems(menuItemsBookshop, selectDropdown);
    activityMenssage(selectTooltips);
    activityMenssage(selectDropdown);
    const searchToggle = getById('searchToggle');
    const searchForm = getById('searchForm');
    const searchInput = getById('searchInput');
    const closeSearch = getById('closeSearch');
    manejoCerrarAbrirBuscador(searchToggle, searchForm, searchInput, closeSearch);
    const userProfile1 = getById('userProfile1');
    const userProfile = getById('userProfile');
    
    const alertsMenu = getById('alertsMenu');
    const alertIcons = getById('alertsIcon');
    manejoCerrarAbrirItem(alertIcons, alertsMenu);
    manejoCerrarAbrirItem(userProfile1,userProfile);

    const storedId = cargarSesionUsuario('currentUserId');
    if (storedId) {
        const u = usuarios.find(user => user.nombre_usuario === storedId || user.correo_electronico === storedId);
        if (u && getById('entradaNombreCompleto')) {
            entradaInicioSesion(u, u.correo_electronico);
        }
    }

    var btnRegistrarUsuario = getById('btnRegistrarUsuario');
    if (btnRegistrarUsuario) {
        btnRegistrarUsuario.addEventListener('click', function (e) {
            e.preventDefault();
            registroUsuario();
        });
    }

    var btnIniciarSesion = getById('btnIniciarSesion');
    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener('click', function (e) {
            e.preventDefault();
            registroIniciarSesion();
        });
    }

    // var btnAgregar = document.getElementById('btn_agregar');
    // if (btnAgregar) {
    //     btnAgregar.addEventListener('click', manejarRegistro);
    // }

});

