// ==========================================
// Dashboard State Management
// ==========================================
let state = {
  allProducts: [],
  filteredProducts: [],
  sortField: 'created_at',
  sortDirection: 'desc',
  currentPage: 1,
  entriesPerPage: 10,
  stockChart: null,
  priceChart: null
};

// ==========================================
// DOM Elements
// ==========================================
const connectionBadge = document.getElementById('connection-badge');
const refreshBtn = document.getElementById('refresh-btn');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterStock = document.getElementById('filter-stock');
const clearFiltersBtn = document.getElementById('clear-filters-btn');
const entriesPerPageSelect = document.getElementById('entries-per-page');
const recordCounterText = document.getElementById('record-counter-text');
const pageNumDisplay = document.getElementById('page-num-display');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');

// Export Buttons
const exportCsvBtn = document.getElementById('export-csv-btn');
const exportExcelBtn = document.getElementById('export-excel-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

// ==========================================
// Initialization & Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  setupEventListeners();
});

function setupEventListeners() {
  // Filters & Search
  searchInput.addEventListener('input', () => {
    state.currentPage = 1;
    applyFilters();
  });
  
  filterStatus.addEventListener('change', () => {
    state.currentPage = 1;
    applyFilters();
  });
  
  filterStock.addEventListener('change', () => {
    state.currentPage = 1;
    applyFilters();
  });
  
  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterStatus.value = 'all';
    filterStock.value = 'all';
    state.currentPage = 1;
    showToast('Filtros de productos limpiados', 'info');
    applyFilters();
  });
  
  // Refresh data
  refreshBtn.addEventListener('click', fetchProducts);
  
  // Entries per page
  entriesPerPageSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    state.entriesPerPage = val === 'all' ? 'all' : parseInt(val);
    state.currentPage = 1;
    renderTable();
  });
  
  // Pagination
  prevPageBtn.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderTable();
    }
  });
  
  nextPageBtn.addEventListener('click', () => {
    const totalPages = getTotalPages();
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderTable();
    }
  });
  
  // Sort Headers
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (state.sortField === field) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
        state.sortDirection = 'asc';
      }
      
      // Update UI classes
      document.querySelectorAll('th.sortable').forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        header.querySelector('i').className = 'fa-solid fa-sort';
      });
      
      th.classList.add(state.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
      th.querySelector('i').className = state.sortDirection === 'asc' 
        ? 'fa-solid fa-sort-up' 
        : 'fa-solid fa-sort-down';
      
      sortAndRender();
    });
  });
  
  // Export handlers
  exportCsvBtn.addEventListener('click', exportCSV);
  exportExcelBtn.addEventListener('click', exportExcel);
  exportPdfBtn.addEventListener('click', () => window.print());
}

// ==========================================
// API Fetching & Fallbacks
// ==========================================
async function fetchProducts() {
  showTableLoader();
  updateConnectionBadge('loading', 'Cargando...');
  
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const result = await response.json();
    state.allProducts = result.data || [];
    
    // Update badge connection source
    if (result.source === 'api') {
      updateConnectionBadge('api', 'API Online');
      showToast('Productos cargados desde la API en tiempo real', 'success');
    } else {
      updateConnectionBadge('mock', 'Modo Offline');
      showToast('Advertencia: Usando catálogo de productos simulado', 'error');
    }
    
    // Initial filter & render
    applyFilters();
  } catch (error) {
    console.error('Error fetching products:', error);
    updateConnectionBadge('mock', 'Error Conexión');
    showToast('Error de conexión al cargar productos.', 'error');
    state.allProducts = [];
    applyFilters();
  }
}

// ==========================================
// Filter and Sort Processing
// ==========================================
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedStatus = filterStatus.value;
  const selectedStock = filterStock.value;
  
  state.filteredProducts = state.allProducts.filter(product => {
    // 1. Search Query Match
    const matchesSearch = !searchTerm || 
      (product.id && product.id.toLowerCase().includes(searchTerm)) ||
      (product.name && product.name.toLowerCase().includes(searchTerm)) ||
      (product.description && product.description.toLowerCase().includes(searchTerm));
      
    // 2. Status Match
    let matchesStatus = true;
    if (selectedStatus === 'active') {
      matchesStatus = product.is_active === true || product.is_active === 'true' || product.is_active === 1;
    } else if (selectedStatus === 'inactive') {
      matchesStatus = product.is_active === false || product.is_active === 'false' || product.is_active === 0;
    }
    
    // 3. Stock Level Match
    let matchesStock = true;
    const stockVal = parseInt(product.stock) || 0;
    if (selectedStock === 'out') {
      matchesStock = stockVal === 0;
    } else if (selectedStock === 'low') {
      matchesStock = stockVal > 0 && stockVal <= 5;
    } else if (selectedStock === 'ok') {
      matchesStock = stockVal > 5;
    }
    
    return matchesSearch && matchesStatus && matchesStock;
  });
  
  updateMetrics();
  updateCharts();
  sortAndRender();
}

function sortAndRender() {
  state.filteredProducts.sort((a, b) => {
    let valA = a[state.sortField];
    let valB = b[state.sortField];
    
    // Handle null values
    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';
    
    // Convert to lowercase strings if applicable
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    
    // Compare dates properly
    if (state.sortField === 'created_at') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    }
    
    // Numeric sort
    if (state.sortField === 'price' || state.sortField === 'stock') {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    }
    
    if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  renderTable();
}

// ==========================================
// Rendering Elements & Widgets
// ==========================================
function renderTable() {
  tableBody.innerHTML = '';
  
  if (state.filteredProducts.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <i class="fa-solid fa-folder-open"></i>
          No se encontraron productos con los filtros seleccionados
        </td>
      </tr>
    `;
    updatePaginationUI(0);
    return;
  }
  
  const totalRecords = state.filteredProducts.length;
  let startIdx = 0;
  let endIdx = totalRecords;
  
  if (state.entriesPerPage !== 'all') {
    startIdx = (state.currentPage - 1) * state.entriesPerPage;
    endIdx = Math.min(startIdx + state.entriesPerPage, totalRecords);
  }
  
  const paginatedList = state.filteredProducts.slice(startIdx, endIdx);
  
  paginatedList.forEach(product => {
    const row = document.createElement('tr');
    
    const priceText = product.price !== undefined && product.price !== null
      ? `$${parseFloat(product.price).toFixed(2)}`
      : 'N/A';
      
    // Stock Level Styling
    const stockVal = parseInt(product.stock) || 0;
    let stockClass = 'badge-stock-ok';
    let stockIcon = 'fa-check';
    if (stockVal === 0) {
      stockClass = 'badge-stock-out';
      stockIcon = 'fa-triangle-exclamation';
    } else if (stockVal <= 5) {
      stockClass = 'badge-stock-low';
      stockIcon = 'fa-triangle-exclamation';
    }
    
    // Status setup
    const isActive = product.is_active === true || product.is_active === 'true' || product.is_active === 1;
    const statusClass = isActive ? 'badge-active' : 'badge-inactive';
    const statusText = isActive ? 'Activo' : 'Inactivo';
    
    // Created Date
    const creationDate = product.created_at ? formatDate(product.created_at) : 'N/A';
    
    row.innerHTML = `
      <td><span class="mono" title="${product.id}">${shortenUUID(product.id)}</span></td>
      <td><strong>${product.name || 'Sin nombre'}</strong></td>
      <td class="desc-cell" title="${product.description || ''}">${product.description || '<em style="color: var(--text-muted)">Sin descripción</em>'}</td>
      <td style="font-weight: 600; color: #fff;">${priceText}</td>
      <td>
        <span class="badge ${stockClass}">
          <i class="fa-solid ${stockIcon}"></i> ${stockVal} uds
        </span>
      </td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
      <td>${creationDate}</td>
    `;
    tableBody.appendChild(row);
  });
  
  updatePaginationUI(totalRecords, startIdx, endIdx);
}

function updatePaginationUI(totalRecords, startIdx = 0, endIdx = 0) {
  if (totalRecords === 0) {
    recordCounterText.textContent = `Mostrando 0 de 0 registros`;
    pageNumDisplay.textContent = `Pág. 1`;
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    return;
  }
  
  recordCounterText.textContent = `Mostrando ${startIdx + 1} - ${endIdx} de ${totalRecords} registros`;
  
  const totalPages = getTotalPages();
  pageNumDisplay.textContent = `Pág. ${state.currentPage} de ${totalPages}`;
  
  prevPageBtn.disabled = state.currentPage === 1;
  nextPageBtn.disabled = state.currentPage === totalPages || state.entriesPerPage === 'all';
}

function updateMetrics() {
  const total = state.filteredProducts.length;
  const active = state.filteredProducts.filter(p => p.is_active === true || p.is_active === 'true' || p.is_active === 1).length;
  const stock = state.filteredProducts.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
  const outOfStock = state.filteredProducts.filter(p => (parseInt(p.stock) || 0) === 0).length;
  
  animateValue('metric-total', total);
  animateValue('metric-active', active);
  animateValue('metric-stock', stock);
  animateValue('metric-out-of-stock', outOfStock);
}

// ==========================================
// Charting (Chart.js integrations)
// ==========================================
function updateCharts() {
  // 1. Stock Status Distribution
  let outCount = 0;
  let lowCount = 0;
  let okCount = 0;
  
  state.filteredProducts.forEach(p => {
    const s = parseInt(p.stock) || 0;
    if (s === 0) outCount++;
    else if (s <= 5) lowCount++;
    else okCount++;
  });
  
  const stockCtx = document.getElementById('stockChart').getContext('2d');
  if (state.stockChart) {
    state.stockChart.destroy();
  }
  
  state.stockChart = new Chart(stockCtx, {
    type: 'doughnut',
    data: {
      labels: ['Agotado (0)', 'Bajo Stock (1-5)', 'Disponible (>5)'],
      datasets: [{
        data: [outCount, lowCount, okCount],
        backgroundColor: ['#f43f5e', '#fbbf24', '#22d3ee'],
        borderWidth: 1,
        borderColor: '#131b2e'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#94a3b8',
            font: { family: 'Outfit', size: 12 }
          }
        }
      }
    }
  });

  // 2. Price Brackets Distribution Bar Chart
  let bracketUnder10 = 0;
  let bracket10to20 = 0;
  let bracketOver20 = 0;
  
  state.filteredProducts.forEach(p => {
    const price = parseFloat(p.price) || 0;
    if (price < 10) bracketUnder10++;
    else if (price <= 20) bracket10to20++;
    else bracketOver20++;
  });
  
  const priceCtx = document.getElementById('priceChart').getContext('2d');
  if (state.priceChart) {
    state.priceChart.destroy();
  }
  
  state.priceChart = new Chart(priceCtx, {
    type: 'bar',
    data: {
      labels: ['Menos de $10', '$10 - $20', 'Más de $20'],
      datasets: [{
        data: [bracketUnder10, bracket10to20, bracketOver20],
        backgroundColor: 'rgba(68, 88, 243, 0.45)',
        borderColor: '#536dfe',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { 
            color: '#94a3b8', 
            font: { family: 'Outfit' },
            stepSize: 1,
            precision: 0
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ==========================================
// Dynamic Export Modules
// ==========================================
function exportCSV() {
  if (state.filteredProducts.length === 0) {
    showToast('No hay productos para exportar', 'error');
    return;
  }
  
  const headers = ['ID Producto', 'ID Barbería', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Estado Activo', 'Fecha Creación'];
  const rows = state.filteredProducts.map(p => [
    p.id,
    p.barbershop_id,
    p.name,
    p.description || '',
    p.price,
    p.stock,
    p.is_active,
    p.created_at
  ]);
  
  // Use semicolon as delimiter, which is default for Excel in Spanish/European locales
  const csvRows = [headers.join(";")];
  
  rows.forEach(rowArray => {
    const row = rowArray.map(val => {
      const text = val !== undefined && val !== null ? val.toString().replace(/"/g, '""') : '';
      return `"${text}"`;
    }).join(";");
    csvRows.push(row);
  });
  
  const csvContent = csvRows.join("\n");
  
  // Create Blob with UTF-8 BOM (\uFEFF) to ensure Spanish characters display correctly
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Reporte_Productos_Barberia_${getTimestamp()}.csv`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
  
  showToast('Archivo CSV descargado con éxito', 'success');
}

function exportExcel() {
  if (state.filteredProducts.length === 0) {
    showToast('No hay productos para exportar', 'error');
    return;
  }
  
  // Format the data array as a flat list of objects matching the desired columns
  const data = state.filteredProducts.map(p => {
    const isActive = p.is_active === true || p.is_active === 'true' || p.is_active === 1;
    return {
      'ID Producto': p.id,
      'ID Barbería': p.barbershop_id,
      'Nombre': p.name || '',
      'Descripción': p.description || '',
      'Precio': parseFloat(p.price || 0),
      'Stock': parseInt(p.stock || 0),
      'Estado': isActive ? 'Activo' : 'Inactivo',
      'Fecha Creación': formatDate(p.created_at)
    };
  });
  
  try {
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    
    // Auto-fit column widths (approximate widths in characters)
    worksheet['!cols'] = [
      { wch: 38 }, // ID Producto (UUID length is 36)
      { wch: 38 }, // ID Barberia (UUID length is 36)
      { wch: 25 }, // Nombre
      { wch: 40 }, // Descripción
      { wch: 10 }, // Precio
      { wch: 10 }, // Stock
      { wch: 12 }, // Estado
      { wch: 20 }  // Fecha Creación
    ];
    
    // Generate native binary Excel file and download
    XLSX.writeFile(workbook, `Reporte_Productos_Barberia_${getTimestamp()}.xlsx`);
    showToast('Archivo Excel (.xlsx) descargado con éxito', 'success');
  } catch (error) {
    console.error('Error generating Excel file with SheetJS:', error);
    showToast('Error al generar el archivo de Excel', 'error');
  }
}

// ==========================================
// Helper Utility Functions
// ==========================================
function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

function shortenUUID(uuid) {
  if (!uuid) return '';
  if (uuid.length <= 12) return uuid;
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 6)}`;
}

function getTotalPages() {
  if (state.entriesPerPage === 'all') return 1;
  return Math.ceil(state.filteredProducts.length / state.entriesPerPage);
}

function updateConnectionBadge(status, text) {
  connectionBadge.className = 'badge';
  
  if (status === 'api') {
    connectionBadge.classList.add('badge-api');
    connectionBadge.innerHTML = `<i class="fa-solid fa-plug-circle-check"></i> ${text}`;
  } else if (status === 'mock') {
    connectionBadge.classList.add('badge-mock');
    connectionBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${text}`;
  } else {
    connectionBadge.classList.add('badge-loading');
    connectionBadge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

function showTableLoader() {
  tableBody.innerHTML = `
    <tr class="table-loading-row">
      <td colspan="7">
        <div class="table-loader">
          <i class="fa-solid fa-spinner fa-spin"></i> Obteniendo catálogo de productos...
        </div>
      </td>
    </tr>
  `;
}

function animateValue(id, endValue) {
  const obj = document.getElementById(id);
  if (!obj) return;
  
  const startValue = parseInt(obj.textContent) || 0;
  if (startValue === endValue) return;
  
  const duration = 800; // ms
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out formula
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + easeProgress * (endValue - startValue));
    
    obj.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      obj.textContent = endValue;
    }
  }
  
  requestAnimationFrame(update);
}

function getTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}_${d.getHours().toString().padStart(2,'0')}${d.getMinutes().toString().padStart(2,'0')}`;
}
