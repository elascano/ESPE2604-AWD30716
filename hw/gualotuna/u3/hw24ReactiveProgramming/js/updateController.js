import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../views/css/common.css';
import '../views/css/register.css';

const API_BASE_URL = 'http://136.113.240.33:3000';
const API_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': 'admin'
};

const registerForm = document.getElementById('register-supply-form');
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  editId = params.get('id');
  
  if (!editId) return;
  
  initUpdate();
});

async function initUpdate() {
  adjustUIForEditing();
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleFormSubmit);
  }
  
  const btnClear = document.getElementById('btn-clear-register');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      registerForm.reset();
    });
  }
  
  await fetchAndPopulateSupply();
}

function adjustUIForEditing() {
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');
  const submitText = document.getElementById('btn-submit-text');
  const submitIcon = document.getElementById('btn-submit-icon');
  
  if (title) title.textContent = 'Editar Insumo';
  if (subtitle) subtitle.textContent = 'Formulario para modificar un insumo existente.';
  if (submitText) submitText.textContent = 'Guardar Cambios';
  if (submitIcon) {
    submitIcon.className = 'bi bi-pencil me-1';
  }
}

async function fetchAndPopulateSupply() {
  try {
    const response = await fetch(`${API_BASE_URL}/fabuladental/supplies`, {
      method: 'GET',
      headers: API_HEADERS
    });
    
    if (!response.ok) throw new Error();
    
    const supplies = await response.json();
    const supply = supplies.find(s => String(s.id) === String(editId));
    
    if (!supply) {
      alert('No se encontró el insumo solicitado.');
      return;
    }
    
    document.getElementById('supplyName').value = supply.supplyName;
    document.getElementById('quantity').value = supply.quantity;
    document.getElementById('unitCost').value = Number(supply.unitCost);
    document.getElementById('orderDate').value = supply.orderDate.substring(0, 10);
    document.getElementById('expirationDate').value = supply.expirationDate.substring(0, 10);
  } catch (error) {
    console.error(error);
    alert('Error al recuperar los datos del insumo.');
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const data = {
    supplyName: document.getElementById('supplyName').value.trim(),
    quantity: parseInt(document.getElementById('quantity').value, 10),
    unitCost: parseFloat(document.getElementById('unitCost').value),
    orderDate: document.getElementById('orderDate').value,
    expirationDate: document.getElementById('expirationDate').value
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/fabuladental/supplies/${editId}`, {
      method: 'PUT',
      headers: API_HEADERS,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error();
    
    window.location.href = 'index.html?success=updated';
  } catch (error) {
    console.error(error);
    alert('No se pudo actualizar el insumo.');
  }
}
