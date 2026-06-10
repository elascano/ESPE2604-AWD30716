let globalCustomers = [];
let filteredCustomers = [];
let currentPage = 1;
const rowsPerPage = 10; 

let customerModal;
let currentEditId = null;

async function loadCustomers() {
    try {
        const response = await fetch('/computerstore/customer');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const allCustomers = await response.json();
        
        globalCustomers = allCustomers.filter(customer => 
            customer.moneySpent !== undefined && customer.moneySpent !== null
        );
        filteredCustomers = [...globalCustomers];
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('table-container').style.display = 'block';
        
        renderTable();
        setupSearch();
        
        customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        alert("Error al cargar los datos. Revisa la consola.");
    }
}

function renderTable() {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    paginatedCustomers.forEach(customer => {
        const nombreMostrar = customer.fullName || customer.name || 'Desconocido';
        const edadMostrar = customer.age || '-'; 
        const dineroGastado = parseFloat(customer.moneySpent);
        const mongoId = customer._id;
        
        const row = `
            <tr>
                <td>${customer.id}</td>
                <td>${nombreMostrar}</td>
                <td>${edadMostrar}</td>
                <td><strong>$${dineroGastado.toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="openEditModal('${mongoId}')">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${mongoId}')">🗑️</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPagination();
    calculateStats(filteredCustomers);
}

function openCreateModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Agregar Nuevo Cliente';
    document.getElementById('customerForm').reset();
    customerModal.show();
}

function openEditModal(mongoId) {
    currentEditId = mongoId;
    document.getElementById('modalTitle').textContent = 'Editar Cliente';
    
    const customer = globalCustomers.find(c => c._id === mongoId);
    
    document.getElementById('customerId').value = customer.id;
    document.getElementById('customerName').value = customer.fullName || customer.name;
    document.getElementById('customerAge').value = customer.age;
    document.getElementById('customerSpent').value = customer.moneySpent;
    
    customerModal.show();
}

async function saveCustomer() {
    const customerData = {
        id: parseInt(document.getElementById('customerId').value),
        fullName: document.getElementById('customerName').value,
        name: document.getElementById('customerName').value,
        age: parseInt(document.getElementById('customerAge').value),
        moneySpent: parseFloat(document.getElementById('customerSpent').value)
    };

    try {
        let url = '/computerstore/customer';
        let method = 'POST';

        if (currentEditId) {
            url = `/computerstore/customer/${currentEditId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) throw new Error('Error al guardar el cliente');

        customerModal.hide();
        alert(currentEditId ? 'Cliente actualizado con éxito' : 'Cliente agregado con éxito');
        loadCustomers();
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al guardar. Revisa la consola.');
    }
}

async function deleteCustomer(mongoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`/computerstore/customer/${mongoId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar el cliente');

            alert('Cliente eliminado');
            loadCustomers();

        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al eliminar. Revisa la consola.');
        }
    }
}

function renderPagination() {
    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderTable();
        });
        
        paginationContainer.appendChild(li);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filteredCustomers = globalCustomers.filter(customer => {
            const name = (customer.fullName || customer.name || 'Desconocido').toLowerCase();
            return name.includes(searchTerm);
        });
        currentPage = 1;
        renderTable();
    });
}

function calculateStats(customers) {
    const totalCustomers = customers.length;
    document.getElementById('totalCustomers').textContent = totalCustomers;
    
    const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c.moneySpent), 0);
    document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    
    const avgSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
    document.getElementById('avgSpent').textContent = `$${avgSpent.toFixed(2)}`;
    
    const customersWithAge = customers.filter(c => c.age);
    const totalAge = customersWithAge.reduce((sum, c) => sum + c.age, 0);
    const avgAge = customersWithAge.length > 0 ? Math.round(totalAge / customersWithAge.length) : 0;
    
    document.getElementById('avgAge').textContent = avgAge;
}

window.addEventListener('load', loadCustomers);