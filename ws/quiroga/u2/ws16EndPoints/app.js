const API_BASE_URL = 'http://localhost:3013/fruitstore';

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

// Cargar lista de clientes
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/fruits`);
        const fruits = await response.json();

        // Limpiar tabla
        customerTableBody.innerHTML = '';

        if (fruits.length === 0) {
            customerTableBody.innerHTML = '<tr><td colspan="3" style="padding: 10px; text-align: center;">No hay frutas registradas</td></tr>';
            return;
        }

        // Llenar tabla con frutas
        fruits.forEach(fruit => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #dee2e6';
            row.innerHTML = `
                <td style="padding: 10px;">${fruit.name}</td>
                <td style="padding: 10px;">${fruit.color}</td>
                <td style="padding: 10px;">$${parseFloat(fruit.price).toFixed(2)}</td>
            `;
            customerTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando frutas:', error);
        customerTableBody.innerHTML = '<tr><td colspan="3" style="padding: 10px; text-align: center; color: red;">Error al cargar frutas</td></tr>';
    }
}

