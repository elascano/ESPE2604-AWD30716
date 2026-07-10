const PAGE_SIZE = 25;
const apiUrl = 'api.php';

let data = [];
let currentPage = 1;
let filtered = [];
let debounceTimer = null;

const searchInput = document.getElementById('search');
const countrySelect = document.getElementById('countryFilter');
const tbody = document.querySelector('#universitiesTable tbody');
const noResults = document.getElementById('noResults');
const resultCount = document.getElementById('resultCount');
const paginationEl = document.getElementById('pagination');
const loading = document.getElementById('loading');
const subtitle = document.getElementById('subtitle');

function filterData() {
    const query = searchInput.value.toLowerCase().trim();
    const country = countrySelect.value.toLowerCase();

    filtered = data.filter(u => {
        if (country && u.country.toLowerCase() !== country) return false;
        if (!query) return true;
        return (u.name + '|' + u.country + '|' + u.domain + '|' + u.web).toLowerCase().includes(query);
    });
}

function render(resetPage = false) {
    filterData();

    if (resetPage) currentPage = 1;

    const total = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);

    const frag = document.createDocumentFragment();
    for (const u of page) {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = u.name;

        const tdCountry = document.createElement('td');
        tdCountry.className = 'country-cell';
        tdCountry.textContent = u.country;

        const tdDomain = document.createElement('td');
        tdDomain.textContent = u.domain;

        const tdWeb = document.createElement('td');
        const a = document.createElement('a');
        a.href = u.web;
        a.textContent = u.web;
        a.target = '_blank';
        a.rel = 'noopener';
        tdWeb.appendChild(a);

        tr.append(tdName, tdCountry, tdDomain, tdWeb);
        frag.appendChild(tr);
    }

    tbody.innerHTML = '';
    tbody.appendChild(frag);

    noResults.style.display = total === 0 ? 'block' : 'none';
    resultCount.textContent = total.toLocaleString() + ' result' + (total !== 1 ? 's' : '');
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    const parts = [];
    const add = (label, page, cls = '') => {
        parts.push(`<button class="${cls}" data-page="${page}">${label}</button>`);
    };

    add('Previous', currentPage - 1, currentPage === 1 ? 'disabled' : '');

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
        add(i, i, i === currentPage ? 'active' : '');
    }

    add('Next', currentPage + 1, currentPage === totalPages ? 'disabled' : '');

    paginationEl.innerHTML = parts.join('');
}

paginationEl.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.classList.contains('disabled')) return;
    const page = parseInt(btn.dataset.page, 10);
    if (isNaN(page)) return;
    currentPage = page;
    render();
    document.querySelector('.table-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

searchInput.addEventListener('keyup', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => render(true), 250);
});

countrySelect.addEventListener('change', () => render(true));

function populateCountries(data) {
    const countries = [...new Set(data.map(u => u.country))].sort();
    countries.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        countrySelect.appendChild(opt);
    });
}

fetch(apiUrl)
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
    })
    .then(json => {
        data = json;
        loading.style.display = 'none';
        populateCountries(data);
        subtitle.textContent = data.length.toLocaleString() + ' universities · ' + countrySelect.options.length + ' countries';
        render(true);
    })
    .catch(err => {
        loading.textContent = 'Error loading data. Please refresh the page.';
        loading.style.color = '#e53e3e';
        console.error(err);
    });
