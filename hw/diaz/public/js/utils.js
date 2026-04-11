// FUNCIONES UTILITARIAS GENERICAS
// Para simplificar el código y evitar escribir document.getElementById repetidamente

function getById(id) {
    return document.getElementById(id);
}

function getByIds(...ids) {
    const elementos = {};
    ids.forEach(id => {
        elementos[id] = document.getElementById(id);
    });
    return elementos;
}

// Establece el texto de un elemento

function setText(elemento, texto) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.textContent = texto;
}

//Establece el HTML de un elemento
function setHTML(elemento, html) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.innerHTML = html;
}

// Obtiene el valor de un input

function getValue(elemento) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    return el ? el.value : '';
}

// Establece el valor de un input
function setValue(elemento, valor) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.value = valor;
}

// Añade una clase a un elemento

function addClass(elemento, clase) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.classList.add(clase);
}

//Remueve una clase de un elemento

function removeClass(elemento, clase) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.classList.remove(clase);
}

//Alterna una clase en un elemento

function toggleClass(elemento, clase) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.classList.toggle(clase);
}

//Muestra u oculta un elemento

function toggleVisibility(elemento, mostrar) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) {
        el.style.display = mostrar ? '' : 'none';
    }
}

//Añade un event listener a un elemento

function onEvent(elemento, evento, callback) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) el.addEventListener(evento, callback);
}

//Remueve todos los hijos de un elemento

function clearChildren(elemento) {
    const el = typeof elemento === 'string' ? getById(elemento) : elemento;
    if (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
}

// Crea un elemento HTML con atributos opcionales

function createElement(tag, attrs = {}, content = '') {
    const el = document.createElement(tag);
    
    Object.keys(attrs).forEach(key => {
        if (key === 'class') {
            el.className = attrs[key];
        } else if (key === 'style') {
            Object.assign(el.style, attrs[key]);
        } else {
            el.setAttribute(key, attrs[key]);
        }
    });
    
    if (content) {
        el.innerHTML = content;
    }
    
    return el;
}

//Muestra un mensaje de alerta personalizado
function mostrarAlerta(mensaje, tipo = 'info') {
    const alertDiv = createElement('div', {
        class: `alert alert-${tipo} alert-dismissible fade show`,
        role: 'alert'
    }, `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `);
    
    // Buscar un contenedor de alertas o crear uno
    let alertContainer = getById('alert-container');
    if (!alertContainer) {
        alertContainer = createElement('div', { id: 'alert-container', class: 'container mt-3' });
        document.body.insertBefore(alertContainer, document.body.firstChild);
    }
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 500);
}
