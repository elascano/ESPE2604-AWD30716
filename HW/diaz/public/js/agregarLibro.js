// AGREGARLIBRO.JS DINAMICO
(function () {
    'use strict';
    
    // Referencias globales del módulo
    let elementos = {};

    // Exponer función pública para inicializar desde el Router/Index
    window.AgregarLibro = {
        init: function() {
            inicializarElementos();
            configurarEventos();
            actualizarListaLibros();
            
            // IMPORTANTE: Inicializar también las validaciones
            if (window.ValidacionLibro) {
                window.ValidacionLibro.inicializar();
            }
        },
        // Exponemos actualizarLista por si se necesita externamente
        actualizarListaLibros: actualizarListaLibros 
    };

    // Ya NO usamos DOMContentLoaded aquí, porque el script se carga al inicio,
    // pero el HTML llega después.

    function inicializarElementos() {
        // Obtenemos los elementos frescos del DOM actual
        elementos = {
            form: document.getElementById('form-agregar-libro'),
            inputTitulo: document.getElementById('input-titulo'),
            inputAutor: document.getElementById('input-autor'),
            inputGenero: document.getElementById('input-genero'),
            inputPortada: document.getElementById('input-portada'),
            previewContainer: document.getElementById('preview-container'),
            previewImage: document.getElementById('preview-image'),
            listaLibros: document.getElementById('lista-libros-agregados'),
            btnGuardar: document.getElementById('btn-guardar')
        };
    }

    function configurarEventos() {
        if (elementos.form) {
            // Removemos listener anterior para evitar duplicados si se recarga la vista
            elementos.form.removeEventListener('submit', manejarSubmitFormulario);
            elementos.form.addEventListener('submit', manejarSubmitFormulario);
        }

        if (elementos.inputPortada) {
            elementos.inputPortada.removeEventListener('input', manejarCambioPortada);
            elementos.inputPortada.addEventListener('input', manejarCambioPortada);
        }
    }

    function manejarCambioPortada() {
        const url = elementos.inputPortada.value.trim();
        if (url) {
            elementos.previewImage.src = url;
            elementos.previewContainer.classList.remove('d-none');
            // El manejo de error de imagen lo hace validarCampoLibro.js ahora
        } else {
            elementos.previewContainer.classList.add('d-none');
        }
    }

    function manejarSubmitFormulario(e) {
        e.preventDefault();

        // 1. Verificar validación nativa (conectada con validarCampoLibro.js)
        if (!elementos.form.checkValidity()) {
            e.stopPropagation();
            // Esto dispara visualmente los estilos de Bootstrap si faltan
            elementos.form.classList.add('was-validated'); 
            return;
        }

        // Recoger valores
        const titulo = elementos.inputTitulo.value.trim();
        const autor = elementos.inputAutor.value.trim();
        const genero = elementos.inputGenero.value;
        const portada = elementos.inputPortada.value.trim();

        try {
            // Verificar Biblioteca
            if (!window.Biblioteca) throw new Error("Librería Biblioteca no cargada");

            const nuevoLibro = new window.Libro(titulo, autor, genero, portada);
            window.Biblioteca.agregarLibro(nuevoLibro);

            // Éxito
            mostrarAlerta(`¡Libro "${titulo}" agregado!`, 'success');
            
            // Limpieza
            elementos.form.reset();
            elementos.form.classList.remove('was-validated');
            elementos.previewContainer.classList.add('d-none');
            
            // Resetear validaciones visuales
            if(window.ValidacionLibro) window.ValidacionLibro.resetear();

            actualizarListaLibros();

            if (window.NotificationService) {
                NotificationService.mostrarNotificacionAgregar(nuevoLibro);
            }

        } catch (error) {
            console.error(error);
            mostrarAlerta('Error al guardar: ' + error.message, 'danger');
        }
    }

    function actualizarListaLibros() {
        // Re-obtener contenedor por seguridad si cambió el DOM
        const contenedor = document.getElementById('lista-libros-agregados');
        if (!contenedor || !window.Biblioteca) return;

        contenedor.innerHTML = '';
        const libros = window.Biblioteca.libros;

        if (libros.length === 0) {
            contenedor.innerHTML = '<div class="alert alert-info">No hay libros aún.</div>';
            return;
        }

        libros.forEach((libro, index) => {
            const div = document.createElement('div');
            div.className = 'list-group-item d-flex justify-content-between align-items-start';
            div.innerHTML = `
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${libro.titulo}</div>
                    ${libro.autor}
                </div>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${libro.id}">X</button>
            `;
            // Listener para eliminar (delegación simple)
            div.querySelector('.btn-eliminar').addEventListener('click', () => {
                 if(confirm('¿Eliminar?')) {
                     window.Biblioteca.eliminarLibro(libro.id);
                     actualizarListaLibros();
                 }
            });
            contenedor.appendChild(div);
        });
    }

    // Helpers simples (si no tienes utils.js cargado en este scope)
    function mostrarAlerta(msg, tipo) {
        const container = document.getElementById('alert-container');
        if(container) {
            container.innerHTML = `<div class="alert alert-${tipo}">${msg}</div>`;
            setTimeout(() => container.innerHTML = '', 3000);
        } else {
            alert(msg);
        }
    }

})();