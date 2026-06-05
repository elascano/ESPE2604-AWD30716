document.addEventListener("DOMContentLoaded", () => {
    // State management
    let customersList = [];
    let filteredList = [];

    // DOM Elements
    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const refreshBtn = document.getElementById("refresh-btn");
    const loader = document.getElementById("loader");
    const tableContainer = document.getElementById("table-container");
    const tbody = document.getElementById("customers-tbody");
    const emptyState = document.getElementById("empty-state");
    const totalCountSpan = document.getElementById("total-customers-count");
    
    // Modal Elements
    const modal = document.getElementById("customer-modal");
    const modalBody = document.getElementById("modal-body-content");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const closeModalFooterBtn = document.getElementById("close-modal-footer-btn");

    // Fetch customers from Express API
    async function fetchCustomers() {
        showLoader(true);
        try {
            const response = await fetch("/computerstore/customers");
            if (!response.ok) {
                throw new Error("Failed to fetch customer data");
            }
            customersList = await response.ok ? await response.json() : [];
            totalCountSpan.textContent = customersList.length;
            applyFilters();
        } catch (error) {
            console.error("API Error:", error);
            showError("Error connecting to server. Please try again later.");
        } finally {
            showLoader(false);
        }
    }

    // Fetch single customer detail
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

    // Apply client-side search & sorting
    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        
        // Filter
        filteredList = customersList.filter(customer => {
            const nameMatch = customer.fullName ? customer.fullName.toLowerCase().includes(query) : false;
            const emailMatch = customer.email ? customer.email.toLowerCase().includes(query) : false;
            const idMatch = customer.id !== undefined && customer.id !== null ? String(customer.id).includes(query) : false;
            return nameMatch || emailMatch || idMatch;
        });

        // Sort
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

    // Render tables into UI
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

            // Format monetary value
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

    // Helper functions for Loader/Error state
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

    // Modal view handler
    function showModal(customer) {
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
    }

    // Event listeners
    searchInput.addEventListener("input", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
    refreshBtn.addEventListener("click", fetchCustomers);
    
    closeModalBtn.addEventListener("click", closeModal);
    closeModalFooterBtn.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Initial load
    fetchCustomers();
});
