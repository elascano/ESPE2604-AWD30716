document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch data from our REST API
        const response = await fetch('/computerstore/customers');
        const customers = await response.json();
        
        const tableBody = document.getElementById('tableBody');
        let totalSum = 0;

        customers.forEach((customer, index) => {
            // Extraer y asegurar que sean números (por si acaso vienen como strings o faltan)
            const moneySpent = Number(customer.moneySpent) || 0;
            const totalSale = Number(customer.totalSale) || 0;
            const saleAmount = moneySpent + totalSale;
            
            totalSum += saleAmount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
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
