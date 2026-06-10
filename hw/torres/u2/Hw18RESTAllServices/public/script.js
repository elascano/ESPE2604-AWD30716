const API_BASE = "/computerstore";

const state = {
  customers: [],
  editingId: null
};

const elements = {
  totalCustomers: document.getElementById("totalCustomers"),
  totalSpent: document.getElementById("totalSpent"),
  serviceMode: document.getElementById("serviceMode"),
  customersBody: document.getElementById("customersBody"),
  addCustomerBtn: document.getElementById("addCustomerBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  modal: document.getElementById("customerModal"),
  modalTitle: document.getElementById("modalTitle"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  cancelModalBtn: document.getElementById("cancelModalBtn"),
  customerForm: document.getElementById("customerForm"),
  customerId: document.getElementById("customerId"),
  customerName: document.getElementById("customerName"),
  customerAge: document.getElementById("customerAge"),
  customerMoney: document.getElementById("customerMoney"),
  formMessage: document.getElementById("formMessage")
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

document.addEventListener("DOMContentLoaded", () => {
  elements.addCustomerBtn.addEventListener("click", () => openModal());
  elements.refreshBtn.addEventListener("click", refresh);
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.cancelModalBtn.addEventListener("click", closeModal);
  elements.customerForm.addEventListener("submit", saveCustomer);

  refresh();
});

async function refresh() {
  await Promise.all([loadHealth(), loadCustomers()]);
}

async function loadHealth() {
  try {
    const response = await fetch("/api/health");
    const payload = await response.json();
    elements.serviceMode.textContent = payload.database === "connected" ? "MongoDB" : "Demo";
  } catch {
    elements.serviceMode.textContent = "Offline";
  }
}

async function loadCustomers() {
  elements.customersBody.innerHTML = row("Loading customers...");

  try {
    const response = await fetch(`${API_BASE}/customers`);
    state.customers = await response.json();
    renderCustomers();
    await loadTotalSpent();
  } catch {
    elements.customersBody.innerHTML = row("The customer API is not available.");
  }
}

async function loadTotalSpent() {
  try {
    const response = await fetch(`${API_BASE}/customers/totalSpent`);
    const payload = await response.json();
    elements.totalSpent.textContent = moneyFormatter.format(Number(payload.total || 0));
  } catch {
    const total = state.customers.reduce((sum, customer) => sum + Number(customer.moneySpent || 0), 0);
    elements.totalSpent.textContent = moneyFormatter.format(total);
  }
}

function renderCustomers() {
  elements.totalCustomers.textContent = state.customers.length;

  if (state.customers.length === 0) {
    elements.customersBody.innerHTML = row("No customers found.");
    return;
  }

  elements.customersBody.innerHTML = state.customers
    .map((customer, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(customer.id ?? "-")}</td>
        <td>${escapeHtml(customer.name || customer.fullName || "Unnamed")}</td>
        <td>${escapeHtml(customer.age ?? "-")}</td>
        <td class="money">${moneyFormatter.format(Number(customer.moneySpent || customer.totalSale || 0))}</td>
        <td>
          <div class="row-actions">
            <button class="secondary-button" type="button" onclick="editCustomer(${Number(customer.id)})">Edit</button>
            <button class="danger-button" type="button" onclick="deleteCustomer(${Number(customer.id)})">Delete</button>
          </div>
        </td>
      </tr>
    `)
    .join("");
}

function openModal(customer = null) {
  state.editingId = customer?.id ?? null;
  elements.modalTitle.textContent = customer ? "Edit Customer" : "Add Customer";
  elements.customerId.disabled = Boolean(customer);
  elements.customerId.value = customer?.id ?? "";
  elements.customerName.value = customer?.name || customer?.fullName || "";
  elements.customerAge.value = customer?.age ?? "";
  elements.customerMoney.value = customer?.moneySpent || customer?.totalSale || "";
  elements.formMessage.textContent = "";
  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  elements.customerForm.reset();
  elements.customerId.disabled = false;
  elements.formMessage.textContent = "";
  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
}

window.editCustomer = async function editCustomer(id) {
  try {
    const response = await fetch(`${API_BASE}/customer/${id}`);
    if (!response.ok) {
      throw new Error("Customer not found.");
    }

    const customer = await response.json();
    openModal(customer);
  } catch (error) {
    alert(error.message);
  }
};

window.deleteCustomer = async function deleteCustomer(id) {
  const confirmed = confirm(`Delete customer ${id}?`);
  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/customer/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload.message || "Could not delete customer.");
    }

    await refresh();
  } catch (error) {
    alert(error.message);
  }
};

async function saveCustomer(event) {
  event.preventDefault();

  const payload = {
    id: Number(elements.customerId.value),
    name: elements.customerName.value.trim(),
    age: Number(elements.customerAge.value),
    moneySpent: Number(elements.customerMoney.value)
  };

  const isEditing = state.editingId !== null;
  const endpoint = isEditing ? `${API_BASE}/customer/${state.editingId}` : `${API_BASE}/customer`;
  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorPayload = await response.json();
      throw new Error(errorPayload.message || "Customer could not be saved.");
    }

    closeModal();
    await refresh();
  } catch (error) {
    elements.formMessage.textContent = error.message;
  }
}

function row(message) {
  return `<tr><td colspan="6" class="empty">${message}</td></tr>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
