console.log('notas.js cargado');

var estudiantes = [
];
var STORAGE_KEY = 'estudiantes_v1';

function loadEstudiantes() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        estudiantes = raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Error leyendo storage', e);
        estudiantes = [];
    }
}

function saveEstudiantes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estudiantes));
    } catch (e) {
        console.error('Error guardando storage', e);
    }
}

function addEstudiante(nombre, nota) {
    nota = Number(nota);

    if (isNaN(nota) || nota < 0 || nota > 10) {
        alert('La calificación debe estar entre 0 y 10');
        return;
    }

    estudiantes.push({
        id: Date.now(),
        nombre: nombre,
        nota: nota
    });

    saveEstudiantes();
    renderAll();
}


function removeEstudiante(id) {
    estudiantes = estudiantes.filter(function (s) {
        return s.id !== id;
    });
    saveEstudiantes();
    renderAll();
}

function calcularPromedio() {
    if (estudiantes.length === 0) return 0;
    var suma = estudiantes.reduce(function (acc, s) {
        return acc + s.nota;
    }, 0);
    return suma / estudiantes.length;
}

function renderStats() {
    var total = estudiantes.length;
    var aprobados = estudiantes.filter(s => s.nota >= 7).length;
    var supletorios = estudiantes.filter(s => s.nota >= 5 && s.nota < 7).length;
    var reprobados = estudiantes.filter(s => s.nota < 5).length;
    var promedio = calcularPromedio();

    var byId = id => document.getElementById(id);

    if (byId('txt_estudiantes')) byId('txt_estudiantes').textContent = total;
    if (byId('txt_aprobados')) byId('txt_aprobados').textContent = aprobados;
    if (byId('txt_supletorios')) byId('txt_supletorios').textContent = supletorios;
    if (byId('txt_reprobados')) byId('txt_reprobados').textContent = reprobados;
    if (byId('promedio_curso')) byId('promedio_curso').textContent = total ? promedio.toFixed(2) : '-';

    if (byId('num_estado_del_curso')) {
        byId('num_estado_del_curso').textContent =
            total ? Math.round((aprobados / total) * 100) + '%' : '0%';
    }

    if (byId('txt_estado_curso')) {
        byId('txt_estado_curso').textContent =
            total ? (promedio >= 7 ? 'Curso aprobado' : 'Curso en riesgo') : 'Sin datos';
    }
}

function renderTable() {
    var tbody = document.getElementById('tbody_estudiantes');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (estudiantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    No hay estudiantes registrados
                </td>
            </tr>`;
        return;
    }

    estudiantes.forEach(function (s, i) {
        var estado = getEstado(s.nota);

        var tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${s.nombre}</td>
            <td class="text-center">${s.nota.toFixed(1)}</td>
            <td class="text-center">
                <span class="badge rounded-pill ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-danger delete-student" data-id="${s.id}">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getEstado(nota) {
    if (nota >= 7) return { texto: 'Aprobado', clase: 'bg-success' };
    if (nota >= 5) return { texto: 'Supletorio', clase: 'bg-warning text-dark' };
    return { texto: 'Reprobado', clase: 'bg-danger' };
}

function renderAll() {
    renderStats();
    renderTable();
}

document.addEventListener('click', function (e) {
    var t = e.target;

    if (t.id === 'btn_agregar_estudiante') {
        e.preventDefault();

        var nombre = document.getElementById('form_nombres_completos')?.value || '';
        var nota = document.getElementById('calificacion')?.value || '';

        if (!nombre) {
            alert('Ingrese el nombre del estudiante');
            return;
        }

        addEstudiante(nombre, nota);

        document.getElementById('form_nombres_completos').value = '';
        document.getElementById('calificacion').value = '';
    }

    if (t.classList.contains('delete-student')) {
        var id = Number(t.dataset.id);
        if (confirm('¿Eliminar estudiante?')) removeEstudiante(id);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    loadEstudiantes();
    renderAll();
});

window.notas_rerender = function () {
    loadEstudiantes();
    renderAll();
};
