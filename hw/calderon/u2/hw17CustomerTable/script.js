let globalCustomers = [];
let filteredCustomers = [];
let currentPage = 1;
const rowsPerPage = 10;

async function loadCustomers() {
    try {
        const response = await fetch('/computerstore/customer');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allCustomers = await response.json();
        
        globalCustomers = allCustomers.filter(customer => 
            customer.moneySpent !== undefined && customer.moneySpent !== null
        );
        filteredCustomers = [...globalCustomers]; 
        document.getElementById('loading').style.display = 'none';
        document.getElementById('table-container').style.display = 'block';
        
        renderTable();
        
        setupSearch();
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error-container').innerHTML = `
            <div class="error-message">
                <strong>Error loading data</strong> ${error.message}
                <br>
                <small>Make sure the server is running.</small>
            </div>
        `;
    }
}

function renderTable() {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    paginatedCustomers.forEach(customer => {
        const nombreMostrar = customer.name || customer.fullName || 'Desconocido';
        const edadMostrar = customer.age || '-'; 
        const dineroGastado = parseFloat(customer.moneySpent);
        
        const row = `
            <tr>
                <td>${customer.id || customer._id}</td>
                <td>${nombreMostrar}</td>
                <td>${edadMostrar}</td>
                <td><strong>$${dineroGastado.toFixed(2)}</strong></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPagination();
    calculateStats(filteredCustomers);
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
            const name = (customer.name || customer.fullName || 'Desconocido').toLowerCase();
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
