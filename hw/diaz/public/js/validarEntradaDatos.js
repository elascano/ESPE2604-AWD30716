function mensajeError(mensaje, elementoId) {
    elementoId.classList.add('is-invalid');
    var feedback = elementoId.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.innerHTML = mensaje;
        feedback.style.display = 'block';
    }
}

function limpiarError(elemento) {
    elemento.classList.remove('is-invalid');
    elemento.classList.add('is-valid');
    var feedback = elemento.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.style.display = 'none';
    }
}

function validarNombreCompleto(valor, elemento) {
    elemento.classList.remove('is-invalid', 'is-valid');
    let numSpaces = valor.split(" ").length - 1;
    if (valor === '') {
        mensajeError('El nombre completo es obligatorio.', elemento);
        return false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
        mensajeError('El nombre completo solo puede contener letras y espacios.', elemento);
        return false;
    } else if (numSpaces < 1) {
        mensajeError('En este campo debe tener dos nombres', elemento);
        return false;
    } else if (/\s{2,}/.test(valor)) {
        mensajeError('No puedes usar espacios consecutivos.', elemento);
        return false;
    } else if (numSpaces >= 2) {
        mensajeError('Solo debe tener dos nombres', elemento);
        return false;
    } else if (valor.length < 3 || valor.length > 50) {
        mensajeError('El nombre completo debe tener entre 3 y 50 caracteres.', elemento);
        return false;
    } else {
        limpiarError(elemento);
        return true;
    }
}

function validarApellidoCompleto(valor, elemento) {
    elemento.classList.remove('is-invalid', 'is-valid');
    let numSpaces = valor.split(" ").length - 1;
    if (valor === '') {
        mensajeError('El apellido completo es obligatorio.', elemento);
        return false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
        mensajeError('El apellido completo solo puede contener letras y espacios.', elemento);
        return false;
    } else if (numSpaces < 1) {
        mensajeError('Debe contener al menos dos apellidos.', elemento);
        return false;
    } else if (/\s{2,}/.test(valor)) {
        mensajeError('No puedes usar espacios consecutivos.', elemento);
        return false;
    } else if (valor.length < 3 || valor.length > 50) {
        mensajeError('El apellido completo debe tener entre 3 y 50 caracteres.', elemento);
        return false;
    } else {
        limpiarError(elemento);
        return true;
    }
}

function validarCorreoElectronico(valor, elemento) {
    elemento.classList.remove('is-invalid', 'is-valid');
    const correoElectronicoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === '') {
        mensajeError('El correo electrónico es obligatorio.', elemento);
        return false;
    } else if (!correoElectronicoRegex.test(valor)) {
        mensajeError('El correo electrónico no es válido.', elemento);
        return false;
    }

    const partes = valor.split('@');
    if (partes.length !== 2) {
        mensajeError('El correo electrónico debe contener exactamente un símbolo @.', elemento);
        return false;
    } else if (partes[1].startsWith('.') || partes[1].endsWith('.')) {
        mensajeError('El correo electrónico no puede comenzar o terminar con un punto.', elemento);
        return false;
    }

    const puntosEnDominio = (partes[1].match(/\./g) || []).length;
    if (puntosEnDominio > 2) {
        mensajeError('El dominio no debe tener más de dos puntos.', elemento);
        return false;
    } else if (/\.{2,}/.test(partes[1])) {
        mensajeError('No puedes usar puntos consecutivos en el correo electrónico.', elemento);
        return false;
    }

    limpiarError(elemento);
    return true;
}

function validarNombreUsuario(valor, elemento) {
    elemento.classList.remove('is-invalid', 'is-valid');
    const nombreUsuarioRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (valor === '') {
        mensajeError('El nombre de usuario es obligatorio.', elemento);
        return false;
    } else if (!nombreUsuarioRegex.test(valor)) {
        mensajeError('Debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.', elemento);
        return false;
    } else {
        limpiarError(elemento);
        return true;
    }
}

function validarContraseñaLogin(valor, elemento) {
    elemento.classList.remove('is-invalid', 'is-valid');
    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (valor === '') {
        mensajeError('La contraseña es obligatoria.', elemento);
        return false;
    } else if (!contrasenaRegex.test(valor)) {
        mensajeError('Debe tener al menos 8 caracteres, incluyendo al menos una letra y un número', elemento);
        return false;
    } else {
        limpiarError(elemento);
        return true;
    }
    // Considerar los espacio del inico y fin de la cadena
    // if (valor !== valor.trim()) {
    //     mensajeError('No uses espacios al inicio ni al final.', elemento);
    //     return false;
    // }
}

function validaEntreContraseñas(valor1, valor2, elemento) {
    elemento.classList.remove('is-invalid', 'is-valid');
    if (valor1 === '') {
        mensajeError('Por favor, confirma tu contraseña.', elemento);
        return false;
    } else if (valor1 !== valor2) {
        mensajeError('Las contraseñas no coinciden.', elemento);
        return false;
    } else {
        limpiarError(elemento);
        return true;
    }
}

function validarDuplicadoEnTiempoReal(valor, atributo, elemento, usuarios) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const existe = usuarios.some(user => user[atributo] === valor);
            if (valor === '') {
                limpiarError(elemento);
                resolve(true);
            } else if (existe) {
                mensajeError(`Este ${atributo.replace('_', ' ')} ya está registrado.`, elemento);
                resolve(false);
            } else {
                limpiarError(elemento);
                resolve(true);
            }
        }, 40);
    });
}

// Faltaria la contrasena
async function validarDuplicados(correoElectronico, nombreUsuario, usuarios) {
    const val1 = await validarDuplicadoEnTiempoReal(correoElectronico.value, 'correo_electronico', correoElectronico, usuarios);
    const val2 = await validarDuplicadoEnTiempoReal(nombreUsuario.value, 'nombre_usuario', nombreUsuario, usuarios);
    return val1 && val2;
}

function validarBotonUsuario(nombreCompleto, apellidoCompleto, correoElectronico, nombreUsuario, contrasena, confirmarContrasena) {
    const val1 = validarNombreCompleto(nombreCompleto.value, nombreCompleto);
    const val2 = validarApellidoCompleto(apellidoCompleto.value, apellidoCompleto);
    const val3 = validarCorreoElectronico(correoElectronico.value, correoElectronico);
    const val4 = validarNombreUsuario(nombreUsuario.value, nombreUsuario);
    const val5 = validarContraseñaLogin(contrasena.value, contrasena);
    const val6 = validaEntreContraseñas(confirmarContrasena.value, contrasena.value, confirmarContrasena);
    return val1 && val2 && val3 && val4 && val5 && val6;
}

function validarBotonInicioSesion(correoElectronico, contrasena) {
    const val1 = validarNombreUsuario(correoElectronico.value, correoElectronico);
    const val2 = validarContraseñaLogin(contrasena.value, contrasena);
    return val1 && val2;
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario_login = getById('formularioLogin');
    if (formulario_login) {
        formulario_login.addEventListener('input', (e) => {
            const t = e.target;
            if (!t.dataset.validate) return;
            switch (t.dataset.validate) {
                case 'correo_electronico':
                    validarCorreoElectronico(t.value.trim(), t);
                    break;
                case 'contraseña':
                    validarContraseñaLogin(t.value.trim(), t);
                    break;
            }
        });
    }

    const formulario_registro_usuario = getById('formularioRegistroUsuario');
    if (formulario_registro_usuario) {
        formulario_registro_usuario.addEventListener('input', (e) => {
            const t = e.target;
            if (!t.dataset.validate) return;
            switch (t.dataset.validate) {
                case 'nombre_completo':
                    validarNombreCompleto(t.value.trim(), t);
                    break;
                case 'apellido_completo':
                    validarApellidoCompleto(t.value.trim(), t);
                    break;
                case 'correo_electronico':
                    validarCorreoElectronico(t.value.trim(), t);
                    break;
                case 'nombre_usuario':
                    validarNombreUsuario(t.value.trim(), t);
                    break;
                case 'contrasena':
                    validarContraseñaLogin(t.value.trim(), t);
                    break;
                case 'confirmar_contrasena':
                    validaEntreContraseñas(t.value.trim(), getById('contrasena').value, t);
                    break;
            }
        });
    }

});