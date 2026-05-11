// Archivo principal de JavaScript
// IMPORTANTE: Asegúrate de que PHP está corriendo. Si abres este HTML con LiveServer, 
// pon aquí la URL de tu servidor PHP local (ej: http://localhost:8000/api.php)
// Si ambos corren en el mismo servidor (php -S localhost:8000), basta con 'api.php'
const API_URL = 'api.php';

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('formPark').addEventListener('submit', createPark);
});

// Función para mostrar alertas
function showAlert(message, type = 'success') {
    const alertsDiv = document.getElementById('alerts');
    alertsDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        alertsDiv.innerHTML = '';
    }, 4000);
}

// Cargar todos los parques
async function loadData() {
    try {
        const response = await fetch(`${API_URL}?action=get_all`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success) {
            renderParks(data.parks);
        } else {
            showAlert(data.message || data.error, 'danger');
        }
    } catch (error) {
        console.error('Error cargando datos:', error);
        showAlert('Error conectando al servidor. Verifica que PHP esté corriendo y la conexión a la base de datos.', 'danger');
    }
}

// Renderizar tabla de parques
function renderParks(parks) {
    const tbody = document.getElementById('parksTableBody');
    tbody.innerHTML = '';
    
    if(parks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay parques</td></tr>';
        return;
    }

    parks.forEach(park => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${park.park_name}</strong></td>
                <td>${park.city}</td>
                <td>${park.province}</td>
                <td>${park.capacity}</td>
                <td>${park.kids_allowed ? 'Sí' : 'No'}</td>
                <td>${park.pets_allowed ? 'Sí' : 'No'}</td>
                <td>${park.manager_name}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePark('${park.park_id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Crear un parque
async function createPark(e) {
    e.preventDefault();
    const park_name = document.getElementById('parkName').value;
    const city = document.getElementById('city').value;
    const province = document.getElementById('province').value;
    const capacity = document.getElementById('capacity').value;
    const kids_allowed = document.getElementById('kidsAllowed').checked;
    const pets_allowed = document.getElementById('petsAllowed').checked;
    const manager_name = document.getElementById('managerName').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_park', park_name, city, province, capacity, kids_allowed, pets_allowed, manager_name })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success) {
            showAlert('Parque registrado correctamente');
            document.getElementById('formPark').reset();
            loadData();
        } else {
            showAlert('Error: ' + (data.error || 'No se pudo crear'), 'danger');
        }
    } catch (error) {
        console.error('Error creando parque:', error);
        showAlert('Error conectando al servidor.', 'danger');
    }
}

// Eliminar parque
window.deletePark = async function(id) {
    if(!confirm('¿Estás seguro de eliminar este parque?')) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_park', id })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success) {
            showAlert('Parque eliminado');
            loadData();
        } else {
            showAlert('Error eliminando parque', 'danger');
        }
    } catch (error) {
        console.error('Error eliminando parque:', error);
        showAlert('Error conectando al servidor.', 'danger');
    }
}
