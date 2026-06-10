const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3013/computerstore';

// Elementos del DOM
const customerForm = document.getElementById('customerForm');
const customerTableBody = document.getElementById('customerTableBody');
const totalSpentSpan = document.getElementById('totalSpent');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const moneySpentInput = document.getElementById('moneySpent');

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadTotalSpent();
});

// Manejar envío del formulario
customerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newCustomer = {
        name: nameInput.value,
        age: parseInt(ageInput.value),
        moneySpent: parseFloat(moneySpentInput.value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/customer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer)
        });

        if (response.ok) {
            alert('Cliente agregado exitosamente');
            customerForm.reset();
            loadCustomers();
            loadTotalSpent();
        } else {
            alert('Error al agregar el cliente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});

let allCustomers = [];

// Cargar lista de clientes
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        allCustomers = await response.json();

        // Limpiar tabla
        customerTableBody.innerHTML = '';

        if (allCustomers.length === 0) {
            customerTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-3 text-muted">No hay clientes registrados</td></tr>';
            return;
        }

        // Llenar tabla con clientes
        allCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.id = `row-${customer.id}`;
            row.innerHTML = `
                <td class="px-3 align-middle">${customer.id}</td>
                <td class="px-3 align-middle">${customer.name}</td>
                <td class="px-3 align-middle">${customer.age}</td>
                <td class="px-3 align-middle">$${(customer.moneySpent != null) ? parseFloat(customer.moneySpent).toFixed(2) : '0.00'}</td>
                <td class="px-3 align-middle">
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary btn-sm" onclick="editCustomer('${customer.id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${customer.id}')">Eliminar</button>
                    </div>
                </td>
            `;
            customerTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando clientes:', error);
        customerTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-3 text-danger">Error al cargar clientes</td></tr>';
    }
}

// Cargar total gastado
async function loadTotalSpent() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/totalSpent`);
        const data = await response.json();
        totalSpentSpan.textContent = parseFloat(data.total).toFixed(2);
    } catch (error) {
        console.error('Error cargando total:', error);
        totalSpentSpan.textContent = '0.00';
    }
}

// Activar edición en la misma fila
function editCustomer(id) {
    const customer = allCustomers.find(c => c.id == id);
    if (!customer) return;

    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    row.innerHTML = `
        <td class="px-3 align-middle">${customer.id}</td>
        <td class="px-3 align-middle">
            <input type="text" id="edit-name-${id}" class="form-control form-control-sm" value="${customer.name}">
        </td>
        <td class="px-3 align-middle">
            <input type="number" id="edit-age-${id}" class="form-control form-control-sm" value="${customer.age}">
        </td>
        <td class="px-3 align-middle">
            <input type="number" id="edit-moneySpent-${id}" step="0.01" min="0" class="form-control form-control-sm" value="${customer.moneySpent != null ? customer.moneySpent : 0}">
        </td>
        <td class="px-3 align-middle">
            <div class="d-flex gap-2">
                <button class="btn btn-success btn-sm" onclick="saveCustomer('${id}')">Guardar</button>
                <button class="btn btn-secondary btn-sm" onclick="cancelEdit('${id}')">Cancelar</button>
            </div>
        </td>
    `;
}

// Cancelar edición (restaurar fila original)
function cancelEdit(id) {
    const customer = allCustomers.find(c => c.id == id);
    if (!customer) return;

    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    row.innerHTML = `
        <td class="px-3 align-middle">${customer.id}</td>
        <td class="px-3 align-middle">${customer.name}</td>
        <td class="px-3 align-middle">${customer.age}</td>
        <td class="px-3 align-middle">$${(customer.moneySpent != null) ? parseFloat(customer.moneySpent).toFixed(2) : '0.00'}</td>
        <td class="px-3 align-middle">
            <div class="d-flex gap-2">
                <button class="btn btn-primary btn-sm" onclick="editCustomer('${customer.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${customer.id}')">Eliminar</button>
            </div>
        </td>
    `;
}

// Guardar cliente editado (PUT)
async function saveCustomer(id) {
    const nameInput = document.getElementById(`edit-name-${id}`);
    const ageInput = document.getElementById(`edit-age-${id}`);
    const moneySpentInput = document.getElementById(`edit-moneySpent-${id}`);

    if (!nameInput || !ageInput || !moneySpentInput) return;

    const updatedCustomer = {
        name: nameInput.value,
        age: parseInt(ageInput.value),
        moneySpent: parseFloat(moneySpentInput.value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCustomer)
        });

        if (response.ok) {
            loadCustomers();
            loadTotalSpent();
        } else {
            alert('Error al actualizar el cliente');
        }
    } catch (error) {
        console.error('Error guardando cliente:', error);
        alert('Error de conexión con el servidor');
    }
}

// Eliminar cliente (DELETE)
async function deleteCustomer(id) {

    try {
        const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCustomers();
            loadTotalSpent();
        } else {
            alert('Error al eliminar el cliente');
        }
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        alert('Error de conexión con el servidor');
    }
}

// Exponer funciones al objeto global 'window' para que sigan funcionando los onclick en el HTML con Vite (tipo módulo)
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.saveCustomer = saveCustomer;
window.cancelEdit = cancelEdit;

