export class ProductView {
    constructor() {
        this.viewList = document.getElementById('view-list');
        this.viewCreate = document.getElementById('view-create');
        
        this.navList = document.getElementById('nav-list');
        this.navCreate = document.getElementById('nav-create');
        
        this.btnAddProduct = document.getElementById('btn-add-product');
        this.btnCancel = document.getElementById('btn-cancel');
        
        this.productForm = document.getElementById('product-form');
        this.errorContainer = document.getElementById('error-container');
        
        this.qtyInput = document.getElementById('quantity');
        this.priceInput = document.getElementById('unit_price');
        this.previewLabel = document.getElementById('total-preview');
        
        this.loadingState = document.getElementById('loading-state');
        this.emptyState = document.getElementById('empty-state');
        this.tableContainer = document.getElementById('table-container');
        this.tbody = document.getElementById('products-tbody');
        this.grandTotalLabel = document.getElementById('grand-total');
    }

    bindNavList(handler) {
        this.navList.addEventListener('click', handler);
        this.btnCancel.addEventListener('click', handler);
    }

    bindNavCreate(handler) {
        this.navCreate.addEventListener('click', handler);
        this.btnAddProduct.addEventListener('click', handler);
    }

    bindSubmitForm(handler) {
        this.productForm.addEventListener('submit', handler);
    }

    bindUpdatePreview(handler) {
        this.qtyInput.addEventListener('input', handler);
        this.priceInput.addEventListener('input', handler);
    }

    switchView(view) {
        if (view === 'list') {
            this.viewList.style.display = 'block';
            this.viewCreate.style.display = 'none';
            this.navList.classList.add('nav-link--active');
            this.navCreate.classList.remove('nav-link--active');
        } else {
            this.viewList.style.display = 'none';
            this.viewCreate.style.display = 'block';
            this.navCreate.classList.add('nav-link--active');
            this.navList.classList.remove('nav-link--active');
            this.resetForm();
        }
    }

    updatePreview() {
        const qty = parseFloat(this.qtyInput.value) || 0;
        const price = parseFloat(this.priceInput.value) || 0;
        const total = qty * price;
        this.previewLabel.textContent = '$' + total.toFixed(2);
    }

    resetForm() {
        this.productForm.reset();
        this.errorContainer.style.display = 'none';
        this.errorContainer.innerHTML = '';
        this.updatePreview();
    }

    showErrors(errors) {
        this.errorContainer.innerHTML = errors.map(err => `<p>${this.escapeHtml(err)}</p>`).join('');
        this.errorContainer.style.display = 'block';
    }

    showLoading() {
        this.loadingState.style.display = 'block';
        this.emptyState.style.display = 'none';
        this.tableContainer.style.display = 'none';
    }

    showEmpty() {
        this.loadingState.style.display = 'none';
        this.emptyState.style.display = 'block';
        this.tableContainer.style.display = 'none';
    }

    showErrorLoading() {
        this.loadingState.style.display = 'none';
        this.emptyState.style.display = 'block';
        this.emptyState.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }

    getFormData() {
        return {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            quantity: parseInt(this.qtyInput.value, 10),
            unit_price: parseFloat(this.priceInput.value)
        };
    }

    renderTable(products, grandTotal) {
        this.loadingState.style.display = 'none';
        
        if (products && products.length > 0) {
            this.tbody.innerHTML = products.map(p => `
                <tr>
                    <td class="td--muted">${this.escapeHtml(p.id)}</td>
                    <td class="td--strong">${this.escapeHtml(p.name)}</td>
                    <td>${this.escapeHtml(p.description)}</td>
                    <td class="td--center">${this.escapeHtml(p.quantity)}</td>
                    <td class="td--right">$${parseFloat(p.unit_price).toFixed(2)}</td>
                    <td class="td--right td--strong">$${parseFloat(p.total_price).toFixed(2)}</td>
                </tr>
            `).join('');
            
            this.grandTotalLabel.textContent = '$' + parseFloat(grandTotal).toFixed(2);
            this.tableContainer.style.display = 'block';
            this.emptyState.style.display = 'none';
        } else {
            this.showEmpty();
        }
    }

    escapeHtml(unsafe) {
        return (unsafe || '').toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
}
