const API = 'api/trucks.php';

const form          = document.getElementById('truck-form');
const formFeedback  = document.getElementById('form-feedback');
const searchInput   = document.getElementById('search-input');
const searchBtn     = document.getElementById('search-btn');
const clearBtn      = document.getElementById('clear-btn');
const searchResults = document.getElementById('search-results');
const truckList     = document.getElementById('truck-list');
const refreshBtn    = document.getElementById('refresh-btn');
const truckCount    = document.getElementById('truck-count');

function statusBadge(status) {
    const cls = status.toLowerCase().replace(/\s+/g, '-');
    return `<span class="status-badge status-${cls}">${status}</span>`;
}

function maintLabel(status) {
    const map = {
        'Overdue':  `<span class="maint-overdue"> Overdue</span>`,
        'Due Soon': `<span class="maint-due-soon"> Due Soon</span>`,
        'Up to Date': `<span class="maint-ok"> Up to Date</span>`,
    };
    return map[status] || status;
}

async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
}

function truckRow(t) {
    return `
        <tr>
            <td><strong>${t.license_plate}</strong></td>
            <td>${t.brand}</td>
            <td>${t.model}</td>
            <td>${t.year}</td>
            <td>${parseFloat(t.capacity_tons).toFixed(2)}</td>
            <td>${t.fuel_type}</td>
            <td>${t.driver_name}</td>
            <td>${t.last_maintenance_date}</td>
            <td>${statusBadge(t.status)}</td>
            <td>${maintLabel(t.maintenance_status)}</td>
        </tr>`;
}

function truckCard(t) {
    return `
        <div class="truck-card">
            <span class="plate">${t.license_plate}</span> —
            ${t.brand} ${t.model} (${t.year}) |
            Driver: ${t.driver_name} |
            Fuel: ${t.fuel_type} |
            ${statusBadge(t.status)} |
            Maintenance: ${maintLabel(t.maintenance_status)}
        </div>`;
}

async function loadAll() {
    try {
        truckList.innerHTML = '<p class="loading">Loading trucks...</p>';
        const data = await apiFetch(API);
        truckCount.textContent = data.count;

        if (data.count === 0) {
            truckList.innerHTML = '<p class="empty">No trucks registered yet.</p>';
            return;
        }

        const rows = data.trucks.map(truckRow).join('');
        truckList.innerHTML = `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Plate</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Cap. (t)</th>
                            <th>Fuel</th>
                            <th>Driver</th>
                            <th>Last Maint.</th>
                            <th>Status</th>
                            <th>Maint. Status</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    } catch (err) {
        truckList.innerHTML = `<p class="feedback error">Error: ${err.error || 'Could not load trucks'}</p>`;
    }
}

async function doSearch() {
    const q = searchInput.value.trim();
    if (!q) {
        searchResults.innerHTML = '';
        return;
    }
    try {
        searchResults.innerHTML = '<p class="loading">Searching...</p>';
        const data = await apiFetch(`${API}?search=${encodeURIComponent(q)}`);
        if (data.count === 0) {
            searchResults.innerHTML = '<p class="empty">No trucks match your search.</p>';
            return;
        }
        searchResults.innerHTML = `<p><strong>${data.count}</strong> result(s) for "${data.query}":</p>`
            + data.trucks.map(truckCard).join('');
    } catch (err) {
        searchResults.innerHTML = `<p class="feedback error">Search failed: ${err.error || 'Unknown error'}</p>`;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formFeedback.textContent = '';
    formFeedback.className = 'feedback';

    const payload = {
        license_plate:         document.getElementById('license_plate').value.trim(),
        brand:                 document.getElementById('brand').value.trim(),
        model:                 document.getElementById('model').value.trim(),
        year:                  parseInt(document.getElementById('year').value, 10),
        capacity_tons:         parseFloat(document.getElementById('capacity_tons').value),
        fuel_type:             document.getElementById('fuel_type').value,
        driver_name:           document.getElementById('driver_name').value.trim(),
        last_maintenance_date: document.getElementById('last_maintenance_date').value,
        status:                document.getElementById('status').value,
    };

    try {
        const data = await apiFetch(API, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        formFeedback.textContent = ` Truck ${data.truck.license_plate} registered successfully! (ID: ${data.truck.id})`;
        formFeedback.className = 'feedback success';
        form.reset();
        loadAll();
    } catch (err) {
        const msg = err.details ? err.details.join('; ') : (err.error || 'Registration failed');
        formFeedback.textContent = ` Error: ${msg}`;
        formFeedback.className = 'feedback error';
    }
});

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') doSearch(); });
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.innerHTML = '';
});

refreshBtn.addEventListener('click', loadAll);

loadAll();
