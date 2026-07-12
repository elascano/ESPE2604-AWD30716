import { fetchAndRenderSupplies } from './readController.js';

const API_BASE_URL = 'http://136.113.240.33:3000';
const API_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': 'admin'
};

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('supplies-table-body');
  if (tableBody) {
    tableBody.addEventListener('click', handleDeleteClick);
  }
});

async function handleDeleteClick(e) {
  const btnDelete = e.target.closest('.btn-delete');
  if (!btnDelete) return;
  
  const id = btnDelete.dataset.id;
  const name = btnDelete.dataset.name;
  
  const confirmed = confirm(`¿Estás seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`);
  if (!confirmed) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/fabuladental/supplies/${id}`, {
      method: 'DELETE',
      headers: API_HEADERS
    });
    
    if (!response.ok) throw new Error();
    
    alert('El insumo fue eliminado correctamente.');
    fetchAndRenderSupplies(document.getElementById('search-input').value.trim());
  } catch (error) {
    console.error(error);
    alert('No se pudo eliminar el insumo.');
  }
}
