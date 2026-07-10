import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../views/css/common.css';
import '../views/css/catalog.css';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';

const API_BASE_URL = 'http://136.113.240.33:3000';
const API_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': 'admin'
};

const searchInput = document.getElementById('search-input');
const suppliesTableBody = document.getElementById('supplies-table-body');
const catalogLoading = document.getElementById('catalog-loading');
const catalogEmpty = document.getElementById('catalog-empty');
const catalogTableWrapper = document.getElementById('catalog-table-wrapper');


document.addEventListener('DOMContentLoaded', () => {
  initRead();
  
  const successParam = new URLSearchParams(window.location.search).get('success');
  if (successParam === 'updated') {
    alert('El insumo fue actualizado correctamente.');
  } else if (successParam === 'created') {
    alert('El insumo fue registrado correctamente.');
  }
});

function initRead() {
  initSearchStream();
  fetchAndRenderSupplies();
}

function initSearchStream() {
  if (searchInput) {
    const searchInput$ = fromEvent(searchInput, 'input').pipe(
      map(e => e.target.value.trim()),
      debounceTime(300),
      distinctUntilChanged()
    );
    
    searchInput$.subscribe(query => {
      fetchAndRenderSupplies(query);
    });
  }
}

export async function fetchAndRenderSupplies(query = '') {
  catalogLoading.classList.remove('d-none');
  catalogTableWrapper.classList.add('d-none');
  catalogEmpty.classList.add('d-none');
  
  try {
    const response = await fetch(`${API_BASE_URL}/fabuladental/supplies`, {
      method: 'GET',
      headers: API_HEADERS
    });
    
    if (!response.ok) throw new Error();
    
    let supplies = await response.json();
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      supplies = supplies.filter(s => s.supplyName && s.supplyName.toLowerCase().includes(lowerQuery));
    }
    
    renderTable(supplies);
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el catálogo de insumos.');
  } finally {
    catalogLoading.classList.add('d-none');
  }
}

function renderTable(supplies) {
  suppliesTableBody.innerHTML = '';
  
  if (supplies.length === 0) {
    catalogTableWrapper.classList.add('d-none');
    catalogEmpty.classList.remove('d-none');
    return;
  }
  
  catalogEmpty.classList.add('d-none');
  catalogTableWrapper.classList.remove('d-none');
  
  const badgeMap = { Current: 'bg-success', NextExpiration: 'bg-warning', Expired: 'bg-danger' };
  const labelMap = { Current: 'Vigente', NextExpiration: 'Por Vencer', Expired: 'Caducado' };
  
  supplies.forEach(supply => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td class="ps-4 fw-semibold supply-name-cell">${supply.supplyName}</td>
      <td class="text-end fw-semibold">${supply.quantity}</td>
      <td class="text-end fw-semibold">$${Number(supply.unitCost).toFixed(2)}</td>
      <td>${supply.orderDate ? supply.orderDate.substring(0, 10) : '—'}</td>
      <td>${supply.expirationDate ? supply.expirationDate.substring(0, 10) : '—'}</td>
      <td>
        <span class="badge fs-6 px-3 py-2 ${badgeMap[supply.status] || 'bg-secondary'}">
          ${labelMap[supply.status] || supply.status}
        </span>
      </td>
      <td class="pe-4">
        <div class="d-flex gap-2">
          <a href="register.html?id=${supply.id}" class="btn btn-outline-primary btn-sm">
            <i class="bi bi-pencil"></i> Editar
          </a>
          <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${supply.id}" data-name="${supply.supplyName}">
            <i class="bi bi-trash3"></i> Eliminar
          </button>
        </div>
      </td>
    `;
    
    suppliesTableBody.appendChild(tr);
  });
}
