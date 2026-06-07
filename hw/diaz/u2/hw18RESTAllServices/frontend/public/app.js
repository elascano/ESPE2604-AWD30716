// Use configured API BASE from config.js or fallback to localhost backend
const API_BASE = window.API_BASE || "http://localhost:3006/computerstore";

// DOM Elements
const customersBody = document.getElementById("customers-body");
const totalEarned = document.getElementById("total-earned");
const statCount = document.getElementById("stat-count");
const refreshBtn = document.getElementById("refresh-btn");
const addCustBtn = document.getElementById("add-cust-btn");
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const toastContainer = document.getElementById("toast-container");

// Modals
const customerModal = document.getElementById("customer-modal");
const customerForm = document.getElementById("customer-form");
const modalTitle = document.getElementById("modal-title");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelFormBtn = document.getElementById("cancel-form-btn");

// Form Inputs
const custMongoId = document.getElementById("cust-mongo-id");
const custName = document.getElementById("cust-name");
const custEmail = document.getElementById("cust-email");
const custType = document.getElementById("cust-type");
const custDiscount = document.getElementById("cust-discount");
const custSale = document.getElementById("cust-sale");

// Confirm Delete Modal
const confirmModal = document.getElementById("confirm-modal");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const deleteCustName = document.getElementById("delete-cust-name");
const deleteCustEmail = document.getElementById("delete-cust-email");

// Application State
let customersState = [];
let deleteTargetId = null;

// Helper: Format currency
const formatMoney = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
};

// Helper: Show Toast Notification
const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const icon = type === "success" 
    ? '<i class="fa-solid fa-circle-check"></i>' 
    : '<i class="fa-solid fa-circle-exclamation"></i>';

  toast.innerHTML = `
    ${icon}
    <div class="toast-content">${message}</div>
    <button class="toast-close-btn">&times;</button>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto remove
  const timeoutId = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);

  // Manual close
  toast.querySelector(".toast-close-btn").addEventListener("click", () => {
    clearTimeout(timeoutId);
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  });
};

// Fetch Total Money spent across database
const fetchTotal = async () => {
  try {
    const response = await fetch(`${API_BASE}/customers/total`);
    if (!response.ok) throw new Error("Could not compute total sales.");
    const data = await response.json();
    totalEarned.textContent = formatMoney(data.total);
  } catch (error) {
    console.error("Error fetching total:", error);
    totalEarned.textContent = "$0.00";
  }
};

// Render Customer list in DOM
const renderCustomers = (customers) => {
  customersBody.innerHTML = "";

  if (customers.length === 0) {
    customersBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <i class="fa-solid fa-users-slash"></i> No customer records match your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  customers.forEach((customer) => {
    const row = document.createElement("tr");
    
    // Type badge style
    let badgeClass = "badge-normal";
    if (customer.type === "VIP") badgeClass = "badge-vip";
    else if (customer.type === "Frequent") badgeClass = "badge-frequent";

    row.innerHTML = `
      <td><strong>#${customer.id ?? "N/A"}</strong></td>
      <td>
        <div class="customer-info-cell">
          <div class="avatar">${(customer.fullName || "?").charAt(0).toUpperCase()}</div>
          <span class="fullname">${customer.fullName ?? ""}</span>
        </div>
      </td>
      <td><span class="email-text">${customer.email ?? ""}</span></td>
      <td><span class="badge ${badgeClass}">${customer.type ?? "Normal"}</span></td>
      <td><span class="discount-value">${customer.discount ? customer.discount + "%" : "0%"}</span></td>
      <td><strong class="sale-amount">${formatMoney(customer.totalSale)}</strong></td>
      <td class="actions-col">
        <button class="action-btn edit-btn" data-id="${customer._id}" title="Edit Customer">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="action-btn delete-btn" data-id="${customer._id}" title="Delete Customer">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    
    // Attach event listeners to edit and delete buttons on the row
    row.querySelector(".edit-btn").addEventListener("click", () => openEditModal(customer));
    row.querySelector(".delete-btn").addEventListener("click", () => openDeleteConfirm(customer));
    
    customersBody.appendChild(row);
  });
};

// Filter and Search logic
const applyFilters = () => {
  const query = searchInput.value.toLowerCase().trim();
  const selectedType = typeFilter.value;

  const filtered = customersState.filter((cust) => {
    const matchesSearch = 
      (cust.fullName && cust.fullName.toLowerCase().includes(query)) ||
      (cust.email && cust.email.toLowerCase().includes(query));
    
    const matchesType = selectedType === "all" || cust.type === selectedType;

    return matchesSearch && matchesType;
  });

  renderCustomers(filtered);
  statCount.textContent = filtered.length;
};

// Fetch all customers from API
const fetchCustomers = async () => {
  customersBody.innerHTML = `
    <tr>
      <td colspan="7" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Refreshing records...
      </td>
    </tr>
  `;
  try {
    const response = await fetch(`${API_BASE}/customers`);
    if (!response.ok) throw new Error("Could not load customers database.");
    customersState = await response.json();
    applyFilters();
    fetchTotal();
  } catch (error) {
    showToast(error.message, "error");
    customersBody.innerHTML = `
      <tr>
        <td colspan="7" class="error-state">
          <i class="fa-solid fa-triangle-exclamation"></i> Error loading database. Please check connection.
        </td>
      </tr>
    `;
  }
};

// Modal handlers
const openCreateModal = () => {
  modalTitle.textContent = "Add Customer";
  customerForm.reset();
  custMongoId.value = "";
  customerModal.classList.add("active");
  custName.focus();
};

const openEditModal = (customer) => {
  modalTitle.textContent = "Edit Customer Details";
  custMongoId.value = customer._id;
  custName.value = customer.fullName || "";
  custEmail.value = customer.email || "";
  custType.value = customer.type || "Normal";
  custDiscount.value = customer.discount ?? 0;
  custSale.value = customer.totalSale ?? 0;
  
  customerModal.classList.add("active");
  custName.focus();
};

const closeModal = () => {
  customerModal.classList.remove("active");
  customerForm.reset();
};

// Create / Update Submit handler
customerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const id = custMongoId.value;
  const payload = {
    fullName: custName.value.trim(),
    email: custEmail.value.trim(),
    type: custType.value,
    discount: Number(custDiscount.value) || 0,
    totalSale: Number(custSale.value) || 0
  };

  const isEdit = !!id;
  const url = isEdit ? `${API_BASE}/customers/${id}` : `${API_BASE}/customers`;
  const method = isEdit ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Operation failed.");
    }

    showToast(
      isEdit ? "Customer records updated successfully!" : "New customer added successfully!", 
      "success"
    );
    closeModal();
    fetchCustomers();
  } catch (error) {
    showToast(error.message, "error");
  }
});

// Delete handlers
const openDeleteConfirm = (customer) => {
  deleteTargetId = customer._id;
  deleteCustName.textContent = customer.fullName || "N/A";
  deleteCustEmail.textContent = customer.email || "N/A";
  confirmModal.classList.add("active");
};

const closeDeleteConfirm = () => {
  confirmModal.classList.remove("active");
  deleteTargetId = null;
};

confirmDeleteBtn.addEventListener("click", async () => {
  if (!deleteTargetId) return;

  try {
    const response = await fetch(`${API_BASE}/customers/${deleteTargetId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to delete record.");
    }

    showToast("Customer record deleted successfully.", "success");
    closeDeleteConfirm();
    fetchCustomers();
  } catch (error) {
    showToast(error.message, "error");
  }
});

// Event Listeners
addCustBtn.addEventListener("click", openCreateModal);
closeModalBtn.addEventListener("click", closeModal);
cancelFormBtn.addEventListener("click", closeModal);

cancelDeleteBtn.addEventListener("click", closeDeleteConfirm);

refreshBtn.addEventListener("click", fetchCustomers);
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);

// Close modals when clicking outside their card content
window.addEventListener("click", (e) => {
  if (e.target === customerModal) closeModal();
  if (e.target === confirmModal) closeDeleteConfirm();
});

// Initial Database Load
fetchCustomers();
