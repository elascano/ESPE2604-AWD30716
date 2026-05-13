const API = '/api/buildings';

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.id === 'tab-' + name);
    t.setAttribute('aria-selected', t.id === 'tab-' + name);
  });
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.toggle('active', p.id === 'panel-' + name);
  });
}

function compute() {
  const year  = parseInt(document.getElementById('year_built').value);
  const area  = parseFloat(document.getElementById('area_sqm').value);
  const value = parseFloat(document.getElementById('value_usd').value);
  const floors = parseInt(document.getElementById('floors').value);
  const box   = document.getElementById('computed-preview');

  if (!year && !area && !value && !floors) { box.classList.add('hidden'); return; }
  box.classList.remove('hidden');

  const age = year ? new Date().getFullYear() - year : null;
  document.getElementById('c-age').textContent = age !== null ? age + ' years' : '—';

  const priceSqm = (value && area) ? (value / area) : null;
  document.getElementById('c-price-sqm').textContent = priceSqm !== null
    ? '$' + priceSqm.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '/m²' : '—';

  const floorAvg = (area && floors) ? (area / floors) : null;
  document.getElementById('c-floor-avg').textContent = floorAvg !== null
    ? floorAvg.toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' m²' : '—';

  let cat = '—';
  if (value) {
    if (value < 500000)       cat = '🟢 Economy';
    else if (value < 2000000) cat = '🔵 Mid-range';
    else if (value < 10000000) cat = '🟣 Premium';
    else                       cat = '🟡 Luxury';
  }
  document.getElementById('c-category').textContent = cat;
}

function computedFromDoc(doc) {
  const age      = new Date().getFullYear() - doc.year_built;
  const priceSqm = doc.area_sqm ? (doc.value_usd / doc.area_sqm).toFixed(2) : 0;
  const floorAvg = doc.floors   ? (doc.area_sqm  / doc.floors).toFixed(1)   : 0;
  let cat = 'Economy';
  if      (doc.value_usd >= 10000000) cat = '🟡 Luxury';
  else if (doc.value_usd >= 2000000)  cat = '🟣 Premium';
  else if (doc.value_usd >= 500000)   cat = '🔵 Mid-range';
  else                                cat = '🟢 Economy';
  return { age, priceSqm, floorAvg, cat };
}

function statusBadge(s) {
  const map = { active: 'badge-active', under_construction: 'badge-construction', renovating: 'badge-renovating', abandoned: 'badge-abandoned' };
  return `<span class="badge ${map[s] || ''}">${s.replace('_', ' ')}</span>`;
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="spinner"></span>Processing…'
    : btn.dataset.label;
}

async function insertBuilding(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-insert');
  if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
  setLoading(btn, true);

  const body = {
    name:       document.getElementById('name').value,
    address:    document.getElementById('address').value,
    floors:     document.getElementById('floors').value,
    area_sqm:   document.getElementById('area_sqm').value,
    type:       document.getElementById('type').value,
    year_built: document.getElementById('year_built').value,
    owner:      document.getElementById('owner').value,
    status:     document.getElementById('status').value,
    value_usd:  document.getElementById('value_usd').value,
    material:   document.getElementById('material').value,
  };

  const box = document.getElementById('insert-result');
  try {
    const res  = await fetch(API + '?action=insert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok && data.inserted_id) {
      box.className = 'result-box success';
      box.innerHTML = `✅ Building inserted successfully!<br><strong>MongoDB ID:</strong> <code>${data.inserted_id}</code>`;
      document.getElementById('form-insert').reset();
      document.getElementById('computed-preview').classList.add('hidden');
    } else {
      box.className = 'result-box error';
      box.innerHTML = '❌ Error: ' + (data.error || 'Unknown error');
    }
  } catch (err) {
    box.className = 'result-box error';
    box.innerHTML = '❌ Network error: ' + err.message;
  }
  box.classList.remove('hidden');
  setLoading(btn, false);
}

async function findBuilding() {
  const id  = document.getElementById('find-id').value.trim();
  const box = document.getElementById('find-result');
  const btn = document.getElementById('btn-find');
  if (!id) { box.className = 'result-box error'; box.textContent = 'Please enter an ID.'; box.classList.remove('hidden'); return; }

  if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
  setLoading(btn, true);

  try {
    const res  = await fetch(`${API}?action=find&id=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (res.ok && !data.error) {
      const c = computedFromDoc(data);
      box.className = 'result-box info';
      box.innerHTML = `
        <div class="building-card">
          <div class="card-title">🏢 ${data.name}</div>
          ${cardField('ID', data._id)}
          ${cardField('Address', data.address)}
          ${cardField('Type', data.type)}
          ${cardField('Owner', data.owner)}
          ${cardField('Floors', data.floors)}
          ${cardField('Area', data.area_sqm.toLocaleString() + ' m²')}
          ${cardField('Year Built', data.year_built)}
          ${cardField('Material', data.material)}
          ${cardField('Value', '$' + Number(data.value_usd).toLocaleString())}
          ${cardField('Status', statusBadge(data.status))}
          <div class="card-computed">
            <span>📅 Age: <strong>${c.age} yrs</strong></span>
            <span>💵 Price/m²: <strong>$${Number(c.priceSqm).toLocaleString()}</strong></span>
            <span>📐 Avg Floor: <strong>${c.floorAvg} m²</strong></span>
            <span>🏷 Category: <strong>${c.cat}</strong></span>
          </div>
        </div>`;
    } else {
      box.className = 'result-box error';
      box.innerHTML = '❌ ' + (data.error || 'Not found');
    }
  } catch (err) {
    box.className = 'result-box error';
    box.innerHTML = '❌ Network error: ' + err.message;
  }
  box.classList.remove('hidden');
  setLoading(btn, false);
}

function cardField(label, value) {
  return `<div class="card-field"><span class="cf-label">${label}</span><span class="cf-value">${value}</span></div>`;
}

async function loadAll() {
  const btn = document.getElementById('btn-load-all');
  const box = document.getElementById('all-result');
  const badge = document.getElementById('all-count');
  if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
  setLoading(btn, true);

  try {
    const res  = await fetch(API + '?action=all');
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Failed');

    badge.textContent = data.length + ' buildings';
    badge.classList.remove('hidden');

    if (data.length === 0) {
      box.innerHTML = '<p style="color:var(--text-muted);padding:20px">No buildings found. Insert some first!</p>';
      box.classList.remove('hidden');
      setLoading(btn, false);
      return;
    }

    const rows = data.map(d => {
      const c = computedFromDoc(d);
      return `<tr>
        <td style="font-family:monospace;font-size:0.75rem;color:var(--text-muted)">${d._id.slice(-8)}…</td>
        <td><strong>${d.name}</strong></td>
        <td>${d.address}</td>
        <td style="text-transform:capitalize">${d.type}</td>
        <td>${d.floors}</td>
        <td>${Number(d.area_sqm).toLocaleString()} m²</td>
        <td>${d.year_built}</td>
        <td>${statusBadge(d.status)}</td>
        <td>$${Number(d.value_usd).toLocaleString()}</td>
        <td style="color:var(--accent2)">${c.age} yrs</td>
        <td style="color:var(--accent2)">$${Number(c.priceSqm).toLocaleString()}/m²</td>
      </tr>`;
    }).join('');

    box.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Address</th><th>Type</th>
            <th>Floors</th><th>Area</th><th>Year</th><th>Status</th>
            <th>Value</th><th>Age ⚡</th><th>$/m² ⚡</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
    box.classList.remove('hidden');
  } catch (err) {
    box.innerHTML = `<p style="color:var(--error);padding:20px">❌ ${err.message}</p>`;
    box.classList.remove('hidden');
  }
  setLoading(btn, false);
}

document.getElementById('year_built').addEventListener('input', compute);
document.getElementById('area_sqm').addEventListener('input', compute);
document.getElementById('value_usd').addEventListener('input', compute);
document.getElementById('floors').addEventListener('input', compute);
