// --- Endpoint Configuration & State ---
const DEFAULT_ENDPOINTS = {
  get: "http://localhost:4001/computerstore/customer",
  post: "http://localhost:4002/computerstore/customer",
  put: "http://localhost:4003/computerstore/customer",
  delete: "http://localhost:4004/computerstore/customer"
};

let endpoints = { ...DEFAULT_ENDPOINTS };

// Load endpoints from LocalStorage if they exist
function loadEndpoints() {
  const stored = localStorage.getItem('microservices_endpoints');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Si detectamos que las rutas no contienen la URI correcta (/computerstore/customer), restablecemos a las por defecto
      if (parsed.get && !parsed.get.includes('/computerstore/customer')) {
        localStorage.removeItem('microservices_endpoints');
        endpoints = { ...DEFAULT_ENDPOINTS };
        console.log("Rutas antiguas o incorrectas detectadas. Se restablecieron a /computerstore/customer.");
      } else {
        endpoints = parsed;
      }
    } catch (e) {
      console.error("Error loading endpoints from local storage:", e);
    }
  }
}

// Save endpoints to LocalStorage
function saveEndpoints(newEndpoints) {
  endpoints = { ...newEndpoints };
  localStorage.setItem('microservices_endpoints', JSON.stringify(endpoints));
}

// --- DOM Elements ---
const customersTableBody = document.getElementById('customersTableBody');
const searchIdInput = document.getElementById('searchId');

// Modals
const addModal = document.getElementById('addModal');
const editModal = document.getElementById('editModal');
const settingsModal = document.getElementById('settingsModal');

// Forms
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const settingsForm = document.getElementById('settingsForm');

// Buttons
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnOpenSettings = document.getElementById('btnOpenSettings');
const closeAddModal = document.getElementById('closeAddModal');
const closeEditModal = document.getElementById('closeEditModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const btnCancelAdd = document.getElementById('btnCancelAdd');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const btnResetSettings = document.getElementById('btnResetSettings');

// Stats
const statTotal = document.getElementById('statTotal');
const statAvgAge = document.getElementById('statAvgAge');
const statTotalMoney = document.getElementById('statTotalMoney');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// --- Global UI helpers ---
function showToast(message, type = 'info') {
  toastMessage.textContent = message;
  
  // Set icon classes
  toastIcon.className = 'fa-solid';
  if (type === 'success') {
    toastIcon.classList.add('fa-circle-check', 'success');
  } else if (type === 'error') {
    toastIcon.classList.add('fa-circle-exclamation', 'error');
  } else {
    toastIcon.classList.add('fa-circle-info', 'info');
  }

  toast.classList.add('show');

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Modal Toggle Helpers
function openModal(modal) {
  modal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
}

// --- API Service Calls ---

// Calculate & Update Dashboard Stats
function updateStats(people) {
  if (!people || people.length === 0) {
    statTotal.textContent = '0';
    statAvgAge.textContent = '0';
    statTotalMoney.textContent = '$0.00';
    return;
  }

  const total = people.length;
  const sumAge = people.reduce((acc, p) => acc + (p.age || 0), 0);
  const avgAge = (sumAge / total).toFixed(1);
  const sumMoney = people.reduce((acc, p) => acc + (p.moneySpent || 0), 0);

  statTotal.textContent = total;
  statAvgAge.textContent = avgAge;
  statTotalMoney.textContent = `$${sumMoney.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Render customers array to the table
function renderTable(people) {
  customersTableBody.innerHTML = '';

  if (people.length === 0) {
    customersTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">No se encontraron registros de clientes.</td>
      </tr>
    `;
    return;
  }

  people.forEach(person => {
    const id = person.id !== undefined && person.id !== null ? person.id : 0;
    const name = person.name || '';
    const age = person.age !== undefined && person.age !== null ? person.age : 0;
    const moneySpent = person.moneySpent !== undefined && person.moneySpent !== null ? person.moneySpent : 0;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="cust-id">${id}</span></td>
      <td><span class="cust-name">${escapeHTML(name)}</span></td>
      <td>${age} años</td>
      <td><span class="cust-money">$${Number(moneySpent).toFixed(2)}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn-row-action edit" onclick="handleEditAction(${id}, '${escapeJS(name)}', ${age}, ${moneySpent})" title="Editar">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-row-action delete" onclick="handleDeleteAction(${id})" title="Eliminar">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;
    customersTableBody.appendChild(row);
  });
}

// Helper to escape HTML characters
function escapeHTML(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Helper to escape single quotes in JS arguments
function escapeJS(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/'/g, "\\'");
}

// Main function to load all customers (GET service)
async function fetchCustomers() {
  customersTableBody.innerHTML = `
    <tr class="loading-row">
      <td colspan="5">
        <div class="loader"></div>
        Cargando datos de clientes...
      </td>
    </tr>
  `;

  const searchVal = searchIdInput.value.trim();
  let url = endpoints.get;

  try {
    if (searchVal !== '') {
      // Seek a single person by ID
      const singleUrl = `${endpoints.get}/${searchVal}`;
      const response = await fetch(singleUrl);
      
      if (response.status === 404) {
        renderTable([]);
        updateStats([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Error en el servidor GET: ${response.statusText}`);
      }

      const person = await response.json();
      renderTable(person ? [person] : []);
      updateStats(person ? [person] : []);
    } else {
      // List all people
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en el servidor GET: ${response.statusText}`);
      }
      const people = await response.json();
      renderTable(people);
      updateStats(people);
    }
  } catch (error) {
    console.error("Fetch customers error:", error);
    showToast(`No se pudo conectar al servicio GET: ${error.message}`, 'error');
    customersTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5" style="color: var(--accent-red)">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
          Error de conexión. Verifica si el servicio GET en ${endpoints.get} está corriendo.
        </td>
      </tr>
    `;
  }
}

// --- Action Handlers ---

// Create Person (POST service)
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = parseInt(document.getElementById('addId').value);
  const name = document.getElementById('addName').value.trim();
  const age = parseInt(document.getElementById('addAge').value);
  const moneySpent = parseFloat(document.getElementById('addMoney').value);

  try {
    const response = await fetch(endpoints.post, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, name, age, moneySpent })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error desconocido al registrar');
    }

    showToast(`Cliente "${name}" registrado con éxito`, 'success');
    closeModal(addModal);
    addForm.reset();
    fetchCustomers();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Populate edit fields and open edit modal
window.handleEditAction = function(id, name, age, moneySpent) {
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editAge').value = age;
  document.getElementById('editMoney').value = moneySpent;
  openModal(editModal);
};

// Update Person (PUT service)
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById('editId').value);
  const name = document.getElementById('editName').value.trim();
  const age = parseInt(document.getElementById('editAge').value);
  const moneySpent = parseFloat(document.getElementById('editMoney').value);

  try {
    const putUrl = `${endpoints.put}/${id}`;
    const response = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, age, moneySpent })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar el registro');
    }

    showToast(`Cliente con ID ${id} actualizado con éxito`, 'success');
    closeModal(editModal);
    fetchCustomers();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Delete Person (DELETE service)
window.handleDeleteAction = async function(id) {
  if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el cliente con ID ${id}?`)) {
    try {
      const deleteUrl = `${endpoints.delete}/${id}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el registro');
      }

      showToast(`Cliente con ID ${id} eliminado correctamente`, 'success');
      fetchCustomers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }
};

// --- Settings Form ---
function populateSettingsForm() {
  document.getElementById('urlGet').value = endpoints.get;
  document.getElementById('urlPost').value = endpoints.post;
  document.getElementById('urlPut').value = endpoints.put;
  document.getElementById('urlDelete').value = endpoints.delete;
}

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newEndpoints = {
    get: document.getElementById('urlGet').value.trim(),
    post: document.getElementById('urlPost').value.trim(),
    put: document.getElementById('urlPut').value.trim(),
    delete: document.getElementById('urlDelete').value.trim()
  };

  saveEndpoints(newEndpoints);
  showToast("Configuración de endpoints guardada con éxito", 'success');
  closeModal(settingsModal);
  fetchCustomers();
});

btnResetSettings.addEventListener('click', () => {
  if (confirm("¿Restaurar los endpoints por defecto de localhost?")) {
    saveEndpoints(DEFAULT_ENDPOINTS);
    populateSettingsForm();
    showToast("Endpoints restaurados a localhost", 'info');
  }
});

// --- Event Listeners for UI interaction ---

// Modal Open/Close triggers
btnOpenAddModal.addEventListener('click', () => openModal(addModal));
btnOpenSettings.addEventListener('click', () => {
  populateSettingsForm();
  openModal(settingsModal);
});

closeAddModal.addEventListener('click', () => closeModal(addModal));
closeEditModal.addEventListener('click', () => closeModal(editModal));
closeSettingsModal.addEventListener('click', () => closeModal(settingsModal));

btnCancelAdd.addEventListener('click', () => closeModal(addModal));
btnCancelEdit.addEventListener('click', () => closeModal(editModal));

// Close modal when clicking background overlay
window.addEventListener('click', (e) => {
  if (e.target === addModal) closeModal(addModal);
  if (e.target === editModal) closeModal(editModal);
  if (e.target === settingsModal) closeModal(settingsModal);
});

// Search input listener with debouncing to prevent excessive queries
let searchTimeout;
searchIdInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchCustomers();
  }, 400);
});

// --- Initialization ---
loadEndpoints();
fetchCustomers();
