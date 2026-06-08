document.addEventListener("DOMContentLoaded", () => {
    let customersList = [];
    let filteredList = [];
    let selectedCustomer = null;


    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const refreshBtn = document.getElementById("refresh-btn");
    const loader = document.getElementById("loader");
    const tableContainer = document.getElementById("table-container");
    const tbody = document.getElementById("customers-tbody");
    const emptyState = document.getElementById("empty-state");
    const totalCountSpan = document.getElementById("total-customers-count");
    const totalSalesSpan = document.getElementById("total-sales-sum");


    const modal = document.getElementById("customer-modal");
    const modalBody = document.getElementById("modal-body-content");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const closeModalFooterBtn = document.getElementById("close-modal-footer-btn");
    const editCustomerBtn = document.getElementById("edit-customer-btn");
    const deleteCustomerBtn = document.getElementById("delete-customer-btn");

    const addCustomerBtn = document.getElementById("add-customer-btn");
    const formModal = document.getElementById("customer-form-modal");
    const closeFormBtn = document.getElementById("close-form-btn");
    const cancelFormBtn = document.getElementById("cancel-form-btn");
    const customerForm = document.getElementById("customer-form");
    const formTitle = document.getElementById("form-modal-title");


    async function fetchCustomers() {
        showLoader(true);
        try {
            const response = await fetch("/computerstore/customers");
            if (!response.ok) {
                throw new Error("Failed to fetch customer data");
            }
            customersList = await response.json();


            totalCountSpan.textContent = customersList.length;
            calculateTotalSales();

            applyFilters();
        } catch (error) {
            console.error("API Error:", error);
            showError("Error connecting to server. Please try again later.");
        } finally {
            showLoader(false);
        }
    }

    function calculateTotalSales() {
        const sum = customersList.reduce((acc, curr) => acc + (curr.totalSale || 0), 0);
        totalSalesSpan.textContent = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(sum);
    }

    async function fetchCustomerDetails(mongoId) {
        try {
            const response = await fetch(`/computerstore/customers/${mongoId}`);
            if (!response.ok) {
                throw new Error("Could not retrieve customer details");
            }
            const customer = await response.json();
            showModal(customer);
        } catch (error) {
            alert("Error: " + error.message);
        }
    }

    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();


        filteredList = customersList.filter(customer => {
            const nameMatch = customer.fullName ? customer.fullName.toLowerCase().includes(query) : false;
            const emailMatch = customer.email ? customer.email.toLowerCase().includes(query) : false;
            const idMatch = customer.id !== undefined && customer.id !== null ? String(customer.id).includes(query) : false;
            return nameMatch || emailMatch || idMatch;
        });


        const sortVal = sortSelect.value;
        filteredList.sort((a, b) => {
            switch (sortVal) {
                case "id-asc":
                    return (a.id || 0) - (b.id || 0);
                case "id-desc":
                    return (b.id || 0) - (a.id || 0);
                case "name-asc":
                    return (a.fullName || "").localeCompare(b.fullName || "");
                case "name-desc":
                    return (b.fullName || "").localeCompare(a.fullName || "");
                case "sale-desc":
                    return (b.totalSale || 0) - (a.totalSale || 0);
                case "sale-asc":
                    return (a.totalSale || 0) - (b.totalSale || 0);
                case "discount-desc":
                    return (b.discount || 0) - (a.discount || 0);
                default:
                    return 0;
            }
        });

        renderTable();
    }


    function renderTable() {
        tbody.innerHTML = "";

        if (filteredList.length === 0) {
            tableContainer.style.display = "none";
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";
        tableContainer.style.display = "block";

        filteredList.forEach(customer => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-id", customer._id);
            tr.addEventListener("click", () => fetchCustomerDetails(customer._id));


            const formattedSale = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(customer.totalSale || 0);

            tr.innerHTML = `
                <td><span class="customer-id">#${customer.id || 'N/A'}</span></td>
                <td style="font-weight: 500;">${customer.fullName || 'Unknown'}</td>
                <td style="font-size: 0.9rem; color: var(--text-secondary);">${customer.email || 'N/A'}</td>
                <td><span class="type-badge">${customer.type || 'Normal'}</span></td>
                <td>${customer.discount || 0}%</td>
                <td><span class="money-badge">${formattedSale}</span></td>
                <td class="actions-col">
                    <button class="btn-action">View Info</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    function showLoader(show) {
        if (show) {
            loader.style.display = "flex";
            tableContainer.style.display = "none";
            emptyState.style.display = "none";
        } else {
            loader.style.display = "none";
        }
    }

    function showError(message) {
        tableContainer.style.display = "none";
        emptyState.style.display = "block";
        emptyState.querySelector("h3").textContent = "Connection Error";
        emptyState.querySelector("p").textContent = message;
    }


    function showModal(customer) {
        selectedCustomer = customer;
        const firstLetter = customer.fullName ? customer.fullName.charAt(0).toUpperCase() : "?";
        const formattedSale = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(customer.totalSale || 0);

        modalBody.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">${firstLetter}</div>
                <div class="profile-info">
                    <div class="info-item full-width">
                        <div class="info-label">Full Name</div>
                        <div class="info-value" style="font-size: 1.2rem; font-weight: 600; color: #fff;">${customer.fullName || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Customer ID</div>
                        <div class="info-value" style="font-family: monospace;">#${customer.id || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Customer Type</div>
                        <div class="info-value">${customer.type || 'N/A'}</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">${customer.email || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Discount Applied</div>
                        <div class="info-value">${customer.discount || 0}%</div>
                    </div>
                    <div class="info-item" style="border-left: 3px solid var(--accent-success);">
                        <div class="info-label">Total Sales</div>
                        <div class="info-value" style="font-size: 1.1rem; font-weight: 700; color: var(--accent-success);">${formattedSale}</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Mongoose Object ID</div>
                        <div class="info-value" style="font-size: 0.8rem; font-family: monospace; color: var(--text-secondary);">${customer._id}</div>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
        selectedCustomer = null;
    }

    function openAddModal() {
        formTitle.textContent = "Add New Customer";
        customerForm.reset();
        document.getElementById("customer-mongo-id").value = "";
        formModal.style.display = "flex";
    }

    function openEditModal() {
        if (!selectedCustomer) return;
        modal.style.display = "none";

        formTitle.textContent = "Edit Customer Details";
        document.getElementById("customer-mongo-id").value = selectedCustomer._id;
        document.getElementById("form-id").value = selectedCustomer.id || "";
        document.getElementById("form-fullName").value = selectedCustomer.fullName || "";
        document.getElementById("form-email").value = selectedCustomer.email || "";
        document.getElementById("form-type").value = selectedCustomer.type || "Normal";
        document.getElementById("form-discount").value = selectedCustomer.discount || 0;
        document.getElementById("form-totalSale").value = selectedCustomer.totalSale || 0;

        formModal.style.display = "flex";
    }

    function closeForm() {
        formModal.style.display = "none";
        customerForm.reset();
    }

    customerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const mongoId = document.getElementById("customer-mongo-id").value;
        const customerData = {
            id: Number(document.getElementById("form-id").value),
            fullName: document.getElementById("form-fullName").value,
            email: document.getElementById("form-email").value,
            type: document.getElementById("form-type").value,
            discount: Number(document.getElementById("form-discount").value),
            totalSale: Number(document.getElementById("form-totalSale").value)
        };

        try {
            let response;
            if (mongoId) {

                response = await fetch(`/computerstore/customers/${mongoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(customerData)
                });
            } else {

                response = await fetch("/computerstore/customers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(customerData)
                });
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to save customer");
            }

            closeForm();
            fetchCustomers();
        } catch (error) {
            alert("Error saving customer data: " + error.message);
        }
    });


    deleteCustomerBtn.addEventListener("click", async () => {
        if (!selectedCustomer) return;
        const confirmDelete = confirm(`Are you sure you want to permanently delete customer: ${selectedCustomer.fullName}?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/computerstore/customers/${selectedCustomer._id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete customer");
            }
            closeModal();
            fetchCustomers();
        } catch (error) {
            alert("Error deleting customer: " + error.message);
        }
    });


    searchInput.addEventListener("input", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
    refreshBtn.addEventListener("click", fetchCustomers);

    closeModalBtn.addEventListener("click", closeModal);
    closeModalFooterBtn.addEventListener("click", closeModal);
    editCustomerBtn.addEventListener("click", openEditModal);


    addCustomerBtn.addEventListener("click", openAddModal);
    closeFormBtn.addEventListener("click", closeForm);
    cancelFormBtn.addEventListener("click", closeForm);

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === formModal) {
            closeForm();
        }
    });

    fetchCustomers();
});
