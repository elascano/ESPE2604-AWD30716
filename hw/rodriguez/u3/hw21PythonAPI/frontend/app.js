const hostname = window.location.hostname;
const API_URL = `http://${hostname}:8000/invoices`;

const form = document.getElementById('invoice-form');
const listContainer = document.getElementById('invoices-list');
const modal = document.getElementById('modal');
const modalDetails = document.getElementById('modal-details');
const closeModal = document.querySelector('.close-modal');

async function fetchInvoices() {
    try {
        const response = await fetch(`${API_URL}/`);
        if (!response.ok) throw new Error('Error al obtener facturas');
        const invoices = await response.json();
        renderInvoices(invoices);
    } catch (error) {
        listContainer.innerHTML = `<p class="empty-msg" style="color: red;">Error de conexión: ${error.message}</p>`;
    }
}

function renderInvoices(invoices) {
    if (invoices.length === 0) {
        listContainer.innerHTML = '<p class="empty-msg">No hay facturas registradas.</p>';
        return;
    }

    listContainer.innerHTML = invoices.map(invoice => {
        const typeClass = invoice.type.toLowerCase() === 'venta' ? 'type-venta' : 'type-compra';
        const badgeClass = invoice.type.toLowerCase() === 'venta' ? 'badge-venta' : 'badge-compra';
        const formattedDate = new Date(invoice.createdAt).toLocaleString();
        
        return `
            <div class="invoice-card ${typeClass}">
                <div class="invoice-card-header">
                    <h3>Factura: ${invoice.number}</h3>
                    <span class="invoice-badge ${badgeClass}">${invoice.type}</span>
                </div>
                <div class="invoice-card-body">
                    <p><strong>Emisor:</strong> ${invoice.issuerName}</p>
                    <p><strong>Cliente:</strong> ${invoice.customerName}</p>
                    <p><strong>Total:</strong> $${invoice.total.toFixed(2)}</p>
                    <p><strong>Fecha:</strong> ${formattedDate}</p>
                </div>
                <div class="invoice-card-actions">
                    <button class="btn btn-secondary" onclick="viewDetails('${invoice.id}')">Ver Detalle</button>
                    <button class="btn btn-danger" onclick="deleteInvoice('${invoice.id}')">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let productsList = [];
    try {
        productsList = JSON.parse(document.getElementById('products').value);
    } catch (err) {
        alert('El formato JSON de los productos no es válido.');
        return;
    }

    const totalVal = parseFloat(document.getElementById('total').value);
    const subtotalVal = totalVal / 1.12;
    const ivaVal = totalVal - subtotalVal;

    const invoiceData = {
        issuerName: document.getElementById('issuerName').value,
        issuerCommercialName: document.getElementById('issuerName').value,
        issuerAddress: "Dirección Emisor S/N",
        issuerRuc: document.getElementById('issuerRuc').value,
        number: document.getElementById('number').value,
        authorizationNumber: "AUT-" + Math.floor(Math.random() * 100000000000),
        emissionType: "Normal",
        accessKey: "ACC-" + Math.floor(Math.random() * 100000000000),
        customerName: document.getElementById('customerName').value,
        customerId: document.getElementById('customerId').value,
        customerDate: new Date().toISOString().split('T')[0],
        customerAddress: "Dirección Cliente S/N",
        customerPhone: "0999999999",
        customerEmail: "cliente@example.com",
        products: productsList,
        subtotal: parseFloat(subtotalVal.toFixed(2)),
        iva: parseFloat(ivaVal.toFixed(2)),
        total: totalVal,
        type: document.getElementById('type').value,
        format: "XML",
        userId: "usuario_sistema",
        workspaceId: "workspace_default"
    };

    try {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData)
        });

        if (!response.ok) throw new Error('Error al registrar factura');
        
        form.reset();
        document.getElementById('products').value = `[\n  {"item_id": "p-01", "name": "Arroz 1kg", "quantity": 5, "price": 1.50},\n  {"item_id": "p-02", "name": "Aceite 1L", "quantity": 1, "price": 8.00}\n]`;
        fetchInvoices();
    } catch (error) {
        alert(error.message);
    }
});

async function viewDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error al cargar detalle');
        const invoice = await response.json();
        modalDetails.textContent = JSON.stringify(invoice, null, 2);
        modal.style.display = 'block';
    } catch (error) {
        alert(error.message);
    }
}

async function deleteInvoice(id) {
    if (!confirm('¿Está seguro de eliminar esta factura?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar factura');
        fetchInvoices();
    } catch (error) {
        alert(error.message);
    }
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

fetchInvoices();
