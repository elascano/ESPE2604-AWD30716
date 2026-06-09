let editingId = null;

const customerModal = document.getElementById('customerModal');
const customerForm = document.getElementById('customerForm');
const modalTitle = document.getElementById('modalTitle');
const inputId = document.getElementById('customerId');
const inputName = document.getElementById('customerName');
const inputAge = document.getElementById('customerAge');
const inputMoney = document.getElementById('customerMoney');

const addCustomerBtn = document.getElementById('addCustomerBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

// Fetch and render customers
async function fetchCustomers() {
    try {
        const response = await fetch('/computerstore/customers');
        const customers = await response.json();
        
        const totalResponse = await fetch('/computerstore/customer/totalSale');
        const totalData = await totalResponse.json();
        const totalSale = totalData.totalSale || 0;
        
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        if (customers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-secondary);">
                        No hay clientes registrados.
                    </td>
                </tr>
            `;
        } else {
            customers.forEach((customer, index) => {
                const moneySpent = Number(customer.moneySpent) || 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${customer.id || 'N/A'}</td>
                    <td>${customer.name || 'N/A'}</td>
                    <td>${customer.age || 'N/A'}</td>
                    <td>$${moneySpent.toFixed(2)}</td>
                    <td style="text-align: center; white-space: nowrap;">
                        <button class="btn-icon-edit edit-btn" title="Editar Cliente">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon-delete delete-btn" title="Eliminar Cliente">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </td>
                `;

                // Add event listeners to buttons
                row.querySelector('.edit-btn').addEventListener('click', () => openModal(customer));
                row.querySelector('.delete-btn').addEventListener('click', () => deleteCustomer(customer.id));

                tableBody.appendChild(row);
            });
        }

        document.getElementById('totalSum').textContent = `$${totalSale.toFixed(2)}`;

    } catch (error) {
        console.error('Error al obtener los datos de los clientes:', error);
    }
}

// Modal management
function openModal(customer = null) {
    if (customer) {
        // Edit Mode
        editingId = customer.id;
        modalTitle.textContent = 'Editar Cliente';
        inputId.value = customer.id;
        inputId.disabled = true; // Cannot edit unique ID field
        inputName.value = customer.name || '';
        inputAge.value = customer.age || '';
        inputMoney.value = customer.moneySpent || 0;
    } else {
        // Add Mode
        editingId = null;
        modalTitle.textContent = 'Agregar Cliente';
        inputId.value = '';
        inputId.disabled = false;
        customerForm.reset();
    }
    customerModal.classList.add('active');
}

// Reset and close modal
function closeModal() {
    customerModal.classList.remove('active');
    customerForm.reset();
    editingId = null;
}

// Delete Customer
async function deleteCustomer(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar al cliente con ID ${id}?`)) {
        try {
            const response = await fetch(`/computerstore/customer/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (response.ok) {
                fetchCustomers();
            } else {
                alert(`Error: ${data.message || 'No se pudo eliminar al cliente'}`);
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('Error de red al intentar eliminar al cliente.');
        }
    }
}

// Form Submission (Add / Edit)
customerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = Number(inputId.value);
    const name = inputName.value.trim();
    const age = Number(inputAge.value);
    const moneySpent = Number(inputMoney.value);

    const bodyData = { id, name, age, moneySpent };

    try {
        let response;
        if (editingId !== null) {
            // Edit
            response = await fetch(`/computerstore/customer/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, moneySpent })
            });
        } else {
            // Add
            response = await fetch('/computerstore/customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
        }

        const data = await response.json();
        
        if (response.ok) {
            closeModal();
            fetchCustomers();
        } else {
            alert(`Error: ${data.message || 'Ocurrió un error en el servidor.'}`);
        }
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        alert('Error de conexión con el servidor.');
    }
});

// Event Listeners for UI
addCustomerBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside content area
customerModal.addEventListener('click', (e) => {
    if (e.target === customerModal) {
        closeModal();
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', fetchCustomers);
