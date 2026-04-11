/**
 * validarCampoLibro.js
 * Módulo de validación diseñado para carga dinámica.
 */

(function () {
    'use strict';

    
    window.ValidacionLibro = {
        inicializar: configurarValidaciones,
        resetear: resetearValidaciones
    };

    let inputs = {};
    let previewImage = null;

    /**
    Esta función debe llamarse CADA VEZ que el HTML del formulariose inyecta en el DOM.
     */
    function configurarValidaciones() {
        const form = document.getElementById('form-agregar-libro');
        
    
        if (!form) return;

    
        inputs = {
            titulo: document.getElementById('input-titulo'),
            autor: document.getElementById('input-autor'),
            genero: document.getElementById('input-genero'),
            portada: document.getElementById('input-portada')
        };
        previewImage = document.getElementById('preview-image');

        
        if (inputs.titulo) inputs.titulo.addEventListener('input', validarTitulo);
        if (inputs.autor) inputs.autor.addEventListener('input', validarAutor);
        if (inputs.genero) inputs.genero.addEventListener('change', validarGenero);
        
        if (inputs.portada) {
            inputs.portada.addEventListener('input', validarUrlPortada);
            
            inputs.portada.addEventListener('blur', validarUrlPortada);
        }


        if (previewImage) {
            previewImage.addEventListener('load', function() {
                if (inputs.portada && inputs.portada.value !== '') {
                    marcarValido(inputs.portada);
                }
            });

            previewImage.addEventListener('error', function() {
                if (inputs.portada && inputs.portada.value !== '') {
                    marcarInvalido(inputs.portada, 'La imagen no existe o no es accesible.');
                }
            });
        }
    }

    function resetearValidaciones() {
        if (!inputs.titulo) return; // Si no hay inputs, salir
        
        Object.values(inputs).forEach(input => {
            if (input) {
                input.classList.remove('is-valid', 'is-invalid');
                input.setCustomValidity('');
            }
        });
    }

    //Funciones de Validacion

    const marcarInvalido = (input, mensaje) => {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = mensaje;
        }
        input.setCustomValidity(mensaje);
    };

    const marcarValido = (input) => {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setCustomValidity('');
    };

    const validarTitulo = () => {
        const el = inputs.titulo;
        const valor = el.value.trim();
        if (valor.length === 0) return marcarInvalido(el, 'El título es obligatorio.') && false;
        if (valor.length < 2) return marcarInvalido(el, 'Mínimo 2 caracteres.') && false;
        if (valor.length > 150) return marcarInvalido(el, 'Máximo 150 caracteres.') && false;
        marcarValido(el);
        return true;
    };

    const validarAutor = () => {
        const el = inputs.autor;
        const valor = el.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-]+$/;
        if (valor.length === 0) return marcarInvalido(el, 'El autor es obligatorio.') && false;
        if (valor.length < 3) return marcarInvalido(el, 'Mínimo 3 caracteres.') && false;
        if (!regex.test(valor)) return marcarInvalido(el, 'Sin números ni símbolos.') && false;
        marcarValido(el);
        return true;
    };

    const validarGenero = () => {
        const el = inputs.genero;
        if (el.value === '' || el.value === 'Selecciona un género') {
            return marcarInvalido(el, 'Selecciona un género.') && false;
        }
        marcarValido(el);
        return true;
    };

    const validarUrlPortada = () => {
        const el = inputs.portada;
        const valor = el.value.trim();
        const urlPattern = /^(https?:\/\/[^\s]+)/;

        if (valor.length === 0) return marcarInvalido(el, 'La URL es obligatoria.') && false;
        if (!urlPattern.test(valor)) return marcarInvalido(el, 'Debe ser URL (http/https).') && false;
        
    
        el.setCustomValidity('');
        el.classList.remove('is-invalid');
        return true;
    };

})();