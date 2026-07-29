const API_URL = '/api/products';

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const state = {
    catalog: []
};

const elements = {
    catalogGrid: document.getElementById('catalogGrid'),
    reloadCatalogBtn: document.getElementById('reloadCatalogBtn'),
    createProductForm: document.getElementById('createProductForm'),
    newProductName: document.getElementById('newProductName'),
    newProductPrice: document.getElementById('newProductPrice'),
    newProductExpiration: document.getElementById('newProductExpiration'),
    createProductResult: document.getElementById('createProductResult'),
    cartForm: document.getElementById('cartForm'),
    cartRows: document.getElementById('cartRows'),
    cartResult: document.getElementById('cartResult'),
    ivaForm: document.getElementById('ivaForm'),
    ivaName: document.getElementById('ivaName'),
    ivaResult: document.getElementById('ivaResult'),
    expirationForm: document.getElementById('expirationForm'),
    expirationName: document.getElementById('expirationName'),
    dayInput: document.getElementById('dayInput'),
    monthInput: document.getElementById('monthInput'),
    yearInput: document.getElementById('yearInput'),
    expirationResult: document.getElementById('expirationResult'),
    productNames: document.getElementById('productNames')
};

const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[character]));

const showEmptyResult = (container, message) => {
    container.className = 'result-box empty';
    container.innerHTML = message;
};

const showError = (container, message) => {
    container.className = 'result-box error';
    container.innerHTML = escapeHtml(message);
};

const showSuccess = (container, title, rows, tone = 'success') => {
    container.className = `result-box ${tone}`;
    container.innerHTML = `
        <div class="result-card">
            <h3>${escapeHtml(title)}</h3>
            <div class="result-list">
                ${rows.map(row => `
                    <div class="result-item">
                        <span>${escapeHtml(row.label)}</span>
                        <strong>${escapeHtml(row.value)}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

const createCartRows = () => {
    elements.cartRows.innerHTML = Array.from({ length: 5 }, (_, index) => `
        <div class="cart-row">
            <span class="row-index">${index + 1}</span>
            <label class="field">
                <span>Product</span>
                <input type="text" data-cart-name placeholder="Product ${index + 1}" required>
            </label>
            <label class="field">
                <span>Price</span>
                <input type="number" data-cart-price min="0" step="0.01" placeholder="0.00" required>
            </label>
        </div>
    `).join('');
};

const renderCatalog = products => {
    if (!products.length) {
        elements.catalogGrid.innerHTML = '<p class="helper-text">No products available.</p>';
        return;
    }

    elements.catalogGrid.innerHTML = products.map(product => `
        <article class="product-card">
            <h3>${escapeHtml(product.name)}</h3>
            <p class="product-price">${money.format(product.price)}</p>
            <p class="product-date">Expires: ${escapeHtml(product.dateExpiration)}</p>
        </article>
    `).join('');
};

const renderDatalist = products => {
    elements.productNames.innerHTML = products.map(product => `
        <option value="${escapeHtml(product.name)}"></option>
    `).join('');
};

const loadCatalog = async () => {
    elements.reloadCatalogBtn.disabled = true;
    elements.reloadCatalogBtn.textContent = 'Loading...';

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Unable to load the catalog.');
        }

        state.catalog = data.data;
        renderCatalog(state.catalog);
        renderDatalist(state.catalog);
    } catch (error) {
        elements.catalogGrid.innerHTML = `<p class="helper-text error-text">${escapeHtml(error.message)}</p>`;
    } finally {
        elements.reloadCatalogBtn.disabled = false;
        elements.reloadCatalogBtn.textContent = 'Refresh catalog';
    }
};

const getCartItems = () => Array.from(elements.cartRows.querySelectorAll('.cart-row')).map(row => ({
    name: row.querySelector('[data-cart-name]').value.trim(),
    price: row.querySelector('[data-cart-price]').value
}));

const postJson = async (url, payload) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'The backend returned an invalid response.');
    }

    return response.json();
};

const init = () => {
    createCartRows();
    loadCatalog();
    showEmptyResult(elements.createProductResult, 'Save a product to add it to the catalog.');
    showEmptyResult(elements.cartResult, 'Enter five products to calculate the total.');
    showEmptyResult(elements.ivaResult, 'Select a product to see the VAT.');
    showEmptyResult(elements.expirationResult, 'Enter a valid date to calculate the remaining days.');

    elements.reloadCatalogBtn.addEventListener('click', loadCatalog);

    elements.createProductForm.addEventListener('submit', async event => {
        event.preventDefault();

        const payload = {
            name: elements.newProductName.value.trim(),
            price: elements.newProductPrice.value,
            dateExpiration: elements.newProductExpiration.value
        };

        if (!payload.name || !payload.price || !payload.dateExpiration) {
            showError(elements.createProductResult, 'Complete all product fields.');
            return;
        }

        showEmptyResult(elements.createProductResult, 'Saving product...');

        try {
            const result = await postJson(API_URL, payload);

            if (!result.success) {
                throw new Error(result.message || 'Unable to save the product.');
            }

            elements.createProductForm.reset();
            showSuccess(elements.createProductResult, 'Product saved', [
                { label: 'Name', value: result.data.name },
                { label: 'Price', value: money.format(result.data.price) },
                { label: 'Expires', value: result.data.dateExpiration }
            ], 'success');

            await loadCatalog();
        } catch (error) {
            showError(elements.createProductResult, error.message);
        }
    });

    elements.cartForm.addEventListener('submit', async event => {
        event.preventDefault();
        const items = getCartItems();

        if (items.some(item => !item.name || item.price === '')) {
            showError(elements.cartResult, 'Fill in the name and price for all five products.');
            return;
        }

        showEmptyResult(elements.cartResult, 'Calculating total...');

        try {
            const result = await postJson(`${API_URL}/cart-total`, { items });

            if (!result.success) {
                throw new Error(result.message || 'Unable to calculate the total.');
            }

            const total = money.format(result.data.total);
            const rows = [
                { label: 'Products', value: String(result.data.items.length) },
                { label: 'Total', value: total }
            ];

            showSuccess(elements.cartResult, 'Cart total', rows, 'success');
        } catch (error) {
            showError(elements.cartResult, error.message);
        }
    });

    elements.ivaForm.addEventListener('submit', async event => {
        event.preventDefault();
        const name = elements.ivaName.value.trim();

        if (!name) {
            showError(elements.ivaResult, 'Type the name of a product.');
            return;
        }

        showEmptyResult(elements.ivaResult, 'Calculating VAT...');

        try {
            const result = await postJson(`${API_URL}/iva`, { name });

            if (!result.success) {
                throw new Error(result.message || 'Unable to calculate the VAT.');
            }

            showSuccess(elements.ivaResult, 'VAT amount', [
                { label: 'Product', value: result.data.productName },
                { label: 'Base', value: money.format(result.data.basePrice) },
                { label: 'VAT', value: money.format(result.data.ivaAmount) }
            ], 'accent');
        } catch (error) {
            showError(elements.ivaResult, error.message);
        }
    });

    elements.expirationForm.addEventListener('submit', async event => {
        event.preventDefault();
        const payload = {
            name: elements.expirationName.value.trim(),
            day: elements.dayInput.value,
            month: elements.monthInput.value,
            year: elements.yearInput.value
        };

        if (!payload.name || !payload.day || !payload.month || !payload.year) {
            showError(elements.expirationResult, 'Complete the product and expiration date.');
            return;
        }

        showEmptyResult(elements.expirationResult, 'Calculating expiration...');

        try {
            const result = await postJson(`${API_URL}/expiration`, payload);

            if (!result.success) {
                throw new Error(result.message || 'Unable to calculate the expiration time.');
            }

            const days = result.data.daysRemaining;
            const stateLabel = days < 0 ? 'Expired' : days === 0 ? 'Expires today' : `${days} days remaining`;

            showSuccess(elements.expirationResult, 'Expiration time', [
                { label: 'Product', value: result.data.productName },
                { label: 'Date', value: result.data.expirationDate },
                { label: 'Status', value: stateLabel }
            ], days < 0 ? 'danger' : 'success');
        } catch (error) {
            showError(elements.expirationResult, error.message);
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
