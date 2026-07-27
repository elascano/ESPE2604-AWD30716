const suppliesTableBody = document.getElementById('suppliesTableBody');
const searchNameInput = document.getElementById('searchName');
const filterStatusSelect = document.getElementById('filterStatus');
const filterQuantityInput = document.getElementById('filterQuantity');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

let suppliesList = [];

async function loadSupplies() {
  try {
    const status = filterStatusSelect.value;
    const maxQuantity = filterQuantityInput.value;

    if (maxQuantity) {
      suppliesList = await api.getSuppliesByQuantity(maxQuantity);
    } else if (status) {
      suppliesList = await api.getSuppliesByStatus(status);
    } else {
      suppliesList = await api.getAllSupplies();
    }

    filterAndRender();
  } catch (error) {
    console.error(error);
    alert('Error connecting to the API');
  }
}

function filterAndRender() {
  const searchTerm = searchNameInput.value.toLowerCase().trim();

  const filtered = suppliesList.filter(item => {
    return item.supplyName.toLowerCase().includes(searchTerm);
  });

  renderTable(filtered);
}

function getStatusLabel(status) {
  switch (status) {
    case 'Current':
      return 'Current';
    case 'NextExpiration':
      return 'Next Expiration';
    case 'Expired':
      return 'Expired';
    default:
      return status;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function renderTable(supplies) {
  suppliesTableBody.innerHTML = '';

  supplies.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.supplyName}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.unitCost)}</td>
      <td>${item.orderDate}</td>
      <td>${item.expirationDate}</td>
      <td>${getStatusLabel(item.status)}</td>
      <td>
        <a href="form.html?id=${item.id}">Edit</a> | 
        <a href="#" onclick="deleteItem(${item.id})">Delete</a>
      </td>
    `;
    suppliesTableBody.appendChild(row);
  });
}

async function deleteItem(id) {
  if (confirm('Do you want to delete this supply?')) {
    try {
      await api.deleteSupply(id);
      loadSupplies();
    } catch (error) {
      console.error(error);
      alert('Error deleting item');
    }
  }
}

function clearFilters() {
  searchNameInput.value = '';
  filterStatusSelect.value = '';
  filterQuantityInput.value = '';
  loadSupplies();
}

searchNameInput.addEventListener('input', filterAndRender);
filterStatusSelect.addEventListener('change', loadSupplies);
filterQuantityInput.addEventListener('input', loadSupplies);
clearFiltersBtn.addEventListener('click', clearFilters);

document.addEventListener('DOMContentLoaded', loadSupplies);
