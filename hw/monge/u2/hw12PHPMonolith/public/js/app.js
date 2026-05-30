/**
 * public/js/app.js
 * 
 * Client-side script handling form validation and real-time 
 * calculation of Subtotal, IVA (15%), and Total.
 */

document.addEventListener('DOMContentLoaded', () => {
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    
    const subtotalInput = document.getElementById('subtotal_preview');
    const ivaInput = document.getElementById('iva_preview');
    const totalInput = document.getElementById('total_preview');
    const form = document.getElementById('product-form');

    /**
     * Recalculates Subtotal, IVA (15%), and Total based on current input values.
     */
    const calculateTotals = () => {
        const qtyVal = quantityInput.value.trim();
        const priceVal = priceInput.value.trim();

        const qty = parseInt(qtyVal, 10);
        const price = parseFloat(priceVal);

        if (isNaN(qty) || qty < 0 || isNaN(price) || price <= 0) {
            subtotalInput.value = '$0.00';
            ivaInput.value = '$0.00';
            totalInput.value = '$0.00';
            return;
        }

        const subtotal = qty * price;
        const iva = subtotal * 0.15; // 15% VAT rate in Ecuador
        const total = subtotal + iva;

        subtotalInput.value = '$' + subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        ivaInput.value = '$' + iva.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        totalInput.value = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Attach listeners if element nodes exist
    if (quantityInput && priceInput) {
        quantityInput.addEventListener('input', calculateTotals);
        priceInput.addEventListener('input', calculateTotals);

        // Run calculations once on load to handle pre-populated edit fields
        calculateTotals();
    }

    // Client-side form validations before submit
    if (form) {
        form.addEventListener('submit', (event) => {
            let hasErrors = false;
            const nameInput = document.getElementById('name');
            const errorsContainer = document.getElementById('validation-errors');

            // Clear previous errors
            errorsContainer.innerHTML = '';
            errorsContainer.classList.add('d-none');

            const errorMessages = [];

            if (nameInput.value.trim() === '') {
                errorMessages.push('Product name is required.');
                nameInput.classList.add('is-invalid');
                hasErrors = true;
            } else if (nameInput.value.trim().length > 150) {
                errorMessages.push('Product name cannot exceed 150 characters.');
                nameInput.classList.add('is-invalid');
                hasErrors = true;
            } else {
                nameInput.classList.remove('is-invalid');
            }

            const qty = parseInt(quantityInput.value, 10);
            if (quantityInput.value.trim() === '' || isNaN(qty) || qty < 0) {
                errorMessages.push('Quantity must be a positive integer or zero.');
                quantityInput.classList.add('is-invalid');
                hasErrors = true;
            } else {
                quantityInput.classList.remove('is-invalid');
            }

            const price = parseFloat(priceInput.value);
            if (priceInput.value.trim() === '' || isNaN(price) || price <= 0) {
                errorMessages.push('Price must be a positive decimal number.');
                priceInput.classList.add('is-invalid');
                hasErrors = true;
            } else {
                priceInput.classList.remove('is-invalid');
            }

            if (hasErrors) {
                event.preventDefault();
                errorsContainer.classList.remove('d-none');
                errorMessages.forEach(msg => {
                    const li = document.createElement('li');
                    li.textContent = msg;
                    errorsContainer.appendChild(li);
                });
                
                // Scroll to top of errors
                errorsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
