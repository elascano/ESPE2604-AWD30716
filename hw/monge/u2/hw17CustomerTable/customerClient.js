document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch data from our REST API
        const response = await fetch('/computerstore/customers');
        const customers = await response.json();
        
        const tableBody = document.getElementById('tableBody');
        let totalSum = 0;

        customers.forEach(customer => {
            // Mongoose models show moneySpent, adjust here based on schema
            const saleAmount = customer.moneySpent || customer.totalSale || 0;
            totalSum += saleAmount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id || 'N/A'}</td>
                <td>$${saleAmount.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById('totalSum').textContent = `$${totalSum.toFixed(2)}`;

    } catch (error) {
        console.error('Error fetching customers:', error);
    }
});
