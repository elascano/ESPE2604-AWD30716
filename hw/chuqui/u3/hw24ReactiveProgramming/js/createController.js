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

document.addEventListener('DOMContentLoaded', () => {
  const hasId = new URLSearchParams(window.location.search).has('id');
  if (hasId) return;
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleFormSubmit);
  }
  
  const btnClear = document.getElementById('btn-clear-register');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      registerForm.reset();
    });
  }
});

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
    const response = await fetch(`${API_BASE_URL}/fabuladental/supply`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error();
    
    window.location.href = 'index.html?success=created';
  } catch (error) {
    console.error(error);
    alert('No se pudo registrar el insumo.');
  }
}
