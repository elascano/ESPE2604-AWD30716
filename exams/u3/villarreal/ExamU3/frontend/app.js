document.addEventListener('DOMContentLoaded', () => {
    const totalUnitsEl = document.getElementById('total-units');
    const masksGrid = document.getElementById('masks-grid');
    const loader = document.getElementById('loader');
    const emptyState = document.getElementById('empty-state');
    const modal = document.getElementById('mask-modal');
    const addMaskBtn = document.getElementById('add-mask-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const maskForm = document.getElementById('mask-form');
    const modalTitle = document.getElementById('modal-title');

    const idInput = document.getElementById('mask-id');
    const serialNumberInput = document.getElementById('serialNumber');
    const brandInput = document.getElementById('brand');
    const modelInput = document.getElementById('model');
    const colorInput = document.getElementById('color');
    const priceInput = document.getElementById('price');
    const unitsInput = document.getElementById('units');

    // Computations DOM
    const cartInputsContainer = document.getElementById('cart-inputs-container');
    const computeCartBtn = document.getElementById('compute-cart-btn');
    const cartResult = document.getElementById('cart-result');
    
    const ivaProductSelect = document.getElementById('iva-product-select');
    const computeIvaBtn = document.getElementById('compute-iva-btn');
    const ivaResult = document.getElementById('iva-result');
    
    const expProductSelect = document.getElementById('exp-product-select');
    const expDay = document.getElementById('exp-day');
    const expMonth = document.getElementById('exp-month');
    const expYear = document.getElementById('exp-year');
    const computeExpBtn = document.getElementById('compute-exp-btn');
    const expResult = document.getElementById('exp-result');

    let masks = [];

    async function init() {
        await fetchData();
    }

    async function fetchData() {
        showLoader();
        try {
            const [fetchedMasks, totalUnits] = await Promise.all([
                api.getMasks(),
                api.getTotalUnits()
            ]);
            masks = fetchedMasks;
            updateTotalUnits(totalUnits);
            renderMasks();
            updateSelects();
        } catch (error) {
            console.error('Failed to initialize app', error);
            alert('Failed to load data. Please ensure the backend servers are running.');
        } finally {
            hideLoader();
        }
    }

    function updateTotalUnits(units) {
        totalUnitsEl.textContent = units.toLocaleString();
    }

    function renderMasks() {
        masksGrid.innerHTML = '';

        if (masks.length === 0) {
            masksGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        masksGrid.style.display = 'grid';

        masks.forEach(mask => {
            const card = document.createElement('div');
            card.className = 'mask-card glass-panel';

            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            });
            const formattedPrice = formatter.format(mask.price);

            card.innerHTML = `
                <div class="sn-badge">SN: ${mask.serialNumber}</div>
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${mask.brand}</h3>
                        <p class="card-subtitle">${mask.model || 'N/A'}</p>
                    </div>
                </div>
                <div class="card-body">
                    <div class="detail-row">
                        <span class="detail-label">Color:</span>
                        <span class="detail-value">${mask.color || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Price:</span>
                        <span class="detail-value" style="color: #10b981; font-weight: bold;">${formattedPrice}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Units in Stock:</span>
                        <span class="detail-value">${mask.units}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="icon-btn edit-btn" data-id="${mask._id}" title="Edit Mask">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="icon-btn delete-btn" data-id="${mask._id}" title="Delete Mask" style="color: var(--accent-danger);">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            masksGrid.appendChild(card);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
    }

    function openModal(isEdit = false, maskData = null) {
        modalTitle.textContent = isEdit ? 'Edit Mask' : 'Add New Mask';
        maskForm.reset();
        idInput.value = '';

        if (isEdit && maskData) {
            idInput.value = maskData._id;
            serialNumberInput.value = maskData.serialNumber;
            brandInput.value = maskData.brand;
            modelInput.value = maskData.model || '';
            colorInput.value = maskData.color || '';
            priceInput.value = maskData.price;
            unitsInput.value = maskData.units;
        }

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const maskData = {
            serialNumber: Number(serialNumberInput.value),
            brand: brandInput.value,
            model: modelInput.value,
            color: colorInput.value,
            price: Number(priceInput.value),
            units: Number(unitsInput.value)
        };

        const id = idInput.value;
        const isEdit = !!id;

        try {
            if (isEdit) {
                await api.updateMask(id, maskData);
            } else {
                await api.createMask(maskData);
            }
            closeModal();
            await fetchData();
        } catch (error) {
            alert(`Failed to ${isEdit ? 'update' : 'create'} mask. See console for details.`);
        }
    }

    function handleEditClick(e) {
        const id = e.currentTarget.dataset.id;
        const mask = masks.find(m => m._id === id);
        if (mask) {
            openModal(true, mask);
        }
    }

    async function handleDeleteClick(e) {
        const id = e.currentTarget.dataset.id;
        if (confirm('Are you sure you want to delete this mask? This action cannot be undone.')) {
            try {
                await api.deleteMask(id);
                await fetchData();
            } catch (error) {
                alert('Failed to delete mask. See console for details.');
            }
        }
    }

    function updateSelects() {
        // Cart selects
        cartInputsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const select = document.createElement('select');
            select.className = 'form-select cart-select';
            select.innerHTML = '<option value="">-- Select Product --</option>';
            masks.forEach(m => {
                select.innerHTML += `<option value="${m._id}">${m.brand} - $${m.price}</option>`;
            });
            cartInputsContainer.appendChild(select);
        }

        // IVA & Expiration selects
        const optionsHtml = '<option value="">-- Select Product --</option>' + masks.map(m => `<option value="${m._id}">${m.brand}</option>`).join('');
        ivaProductSelect.innerHTML = optionsHtml;
        expProductSelect.innerHTML = optionsHtml;
    }

    async function handleComputeCart() {
        const selects = document.querySelectorAll('.cart-select');
        const selectedProducts = [];
        for (const select of selects) {
            if (select.value) {
                const mask = masks.find(m => m._id === select.value);
                if (mask) selectedProducts.push(mask);
            }
        }
        
        if (selectedProducts.length !== 5) {
            alert('Please select exactly 5 products for the cart total.');
            return;
        }

        try {
            computeCartBtn.textContent = 'Computing...';
            const total = await api.computeCartTotal(selectedProducts);
            const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
            cartResult.textContent = formatter.format(total);
        } catch (error) {
            alert('Failed to compute cart total.');
        } finally {
            computeCartBtn.textContent = 'Compute Total';
        }
    }

    async function handleComputeIva() {
        if (!ivaProductSelect.value) {
            alert('Please select a product.');
            return;
        }
        const product = masks.find(m => m._id === ivaProductSelect.value);
        try {
            computeIvaBtn.textContent = 'Computing...';
            const iva = await api.computeIVA(product);
            const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
            ivaResult.textContent = formatter.format(iva);
        } catch (error) {
            alert('Failed to compute IVA.');
        } finally {
            computeIvaBtn.textContent = 'Compute IVA (16%)';
        }
    }

    async function handleComputeExp() {
        if (!expProductSelect.value || !expDay.value || !expMonth.value || !expYear.value) {
            alert('Please select a product and enter the full expiration date.');
            return;
        }
        const product = masks.find(m => m._id === expProductSelect.value);
        try {
            computeExpBtn.textContent = 'Computing...';
            const daysLeft = await api.computeExpiration(product, Number(expDay.value), Number(expMonth.value), Number(expYear.value));
            if (daysLeft < 0) {
                expResult.textContent = `Expired ${Math.abs(daysLeft)} days ago`;
                expResult.style.color = 'var(--accent-danger)';
            } else {
                expResult.textContent = `${daysLeft} days left`;
                expResult.style.color = '#10b981';
            }
        } catch (error) {
            alert('Failed to compute expiration days.');
        } finally {
            computeExpBtn.textContent = 'Compute Days Left';
        }
    }

    function showLoader() {
        loader.style.display = 'flex';
        masksGrid.style.display = 'none';
        emptyState.style.display = 'none';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    addMaskBtn.addEventListener('click', () => openModal(false));
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    maskForm.addEventListener('submit', handleFormSubmit);

    computeCartBtn.addEventListener('click', handleComputeCart);
    computeIvaBtn.addEventListener('click', handleComputeIva);
    computeExpBtn.addEventListener('click', handleComputeExp);

    init();
});
