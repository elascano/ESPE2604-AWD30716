document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/computerstore/customers');
        const customers = await response.json();
        
        const totalResponse = await fetch('/computerstore/customer/totalSale');
        const totalData = await totalResponse.json();
        const totalSale = totalData.totalSale || 0;
        
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        customers.forEach((customer, index) => {
            const moneySpent = Number(customer.moneySpent) || 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${customer.id || 'N/A'}</td>
                <td>${customer.name || 'N/A'}</td>
                <td>${customer.age || 'N/A'}</td>
                <td>$${moneySpent.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById('totalSum').textContent = `$${totalSale.toFixed(2)}`;

    } catch (error) {
        console.error('Error al obtener los datos de los clientes:', error);
    }
});
