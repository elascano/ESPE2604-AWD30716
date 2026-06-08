const API_BASE_URL = "/computerstore";

const customerForm = document.getElementById("customerForm");
const customerIdInput = document.getElementById("customerId");
const customerTableBody = document.getElementById("customerTableBody");
const customerTableHead = document.getElementById("customerTableHead");
const totalSpentSpan = document.getElementById("totalSpent");
const statusText = document.getElementById("statusText");
const formStatus = document.getElementById("formStatus");
const formTitle = document.getElementById("formTitle");
const modePill = document.getElementById("modePill");
const submitBtn = document.getElementById("submitBtn");
const deleteBtn = document.getElementById("deleteBtn");
const resetBtn = document.getElementById("resetBtn");
const refreshBtn = document.getElementById("refreshBtn");
const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  age: document.getElementById("age"),
  type: document.getElementById("type"),
  discount: document.getElementById("discount"),
  moneySpent: document.getElementById("moneySpent")
};
const visibleColumns = ["id", "name", "email", "age", "type", "discount", "moneySpent", "totalSale", "_id"];

let customers = [];

document.addEventListener("DOMContentLoaded", loadDashboard);
customerForm.addEventListener("submit", saveCustomer);
resetBtn.addEventListener("click", resetForm);
deleteBtn.addEventListener("click", deleteSelectedCustomer);
refreshBtn.addEventListener("click", loadDashboard);

async function loadDashboard() {
  await loadCustomers();
  await loadTotalSpent();
}

async function loadCustomers() {
  try {
    statusText.textContent = "Loading";
    const response = await fetch(`${API_BASE_URL}/customers`);

    if (!response.ok) {
      throw new Error("Could not load customers");
    }

    customers = await response.json();
    renderCustomers(customers);
    statusText.textContent = `${customers.length} Loaded`;
  } catch (error) {
    customers = [];
    console.error(error);
    customerTableHead.innerHTML = "<th>Status</th>";
    customerTableBody.innerHTML = '<tr><td class="message error">Could not get the customers. Check the server and MongoDB connection.</td></tr>';
    statusText.textContent = "Error";
    setStatus(error.message, true);
  }
}

async function loadTotalSpent() {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/totalSpent`);

    if (!response.ok) {
      throw new Error("Could not load total spent");
    }

    const data = await response.json();
    totalSpentSpan.textContent = Number(data.total || 0).toFixed(2);
  } catch (error) {
    console.error(error);
    totalSpentSpan.textContent = "0.00";
  }
}

async function saveCustomer(event) {
  event.preventDefault();

  const customerId = customerIdInput.value;
  const isEditing = Boolean(customerId);
  const payload = getFormPayload();
  const url = isEditing ? `${API_BASE_URL}/customers/${customerId}` : `${API_BASE_URL}/customers`;
  const method = isEditing ? "PUT" : "POST";

  try {
    setStatus(`${method} request in progress...`);
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Could not ${isEditing ? "update" : "create"} customer`);
    }

    resetForm();
    await loadDashboard();
    setStatus(isEditing ? "Customer updated successfully." : "Customer created successfully.");
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
}

async function deleteSelectedCustomer() {
  const customerId = customerIdInput.value;

  if (!customerId) {
    return;
  }

  const customer = customers.find((item) => getCustomerKey(item) === customerId);
  const label = getCustomerName(customer);

  if (!confirm(`Delete ${label}?`)) {
    return;
  }

  try {
    setStatus("DELETE request in progress...");
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Could not delete customer");
    }

    resetForm();
    await loadDashboard();
    setStatus("Customer deleted successfully.");
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
}

function renderCustomers(list) {
  customerTableBody.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    customerTableHead.innerHTML = "<th>Customers</th>";
    customerTableBody.innerHTML = '<tr><td class="message">No customers found in the database.</td></tr>';
    return;
  }

  customerTableHead.innerHTML = [...visibleColumns.map(formatHeader), "Actions"].map((heading) => `<th>${heading}</th>`).join("");
  const fragment = document.createDocumentFragment();

  list.forEach((customer) => {
    const row = document.createElement("tr");

    visibleColumns.forEach((column) => {
      const cell = document.createElement("td");
      cell.textContent = formatValue(column, customer[column]);

      if (column === "moneySpent" || column === "totalSale") {
        cell.className = "money";
      }

      row.appendChild(cell);
    });

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    actions.className = "row-actions";
    editButton.className = "secondary";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => selectCustomer(customer));
    deleteButton.className = "danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteCustomer(customer));

    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);
    fragment.appendChild(row);
  });

  customerTableBody.appendChild(fragment);
}

async function deleteCustomer(customer) {
  const customerId = getCustomerKey(customer);

  if (!confirm(`Delete ${getCustomerName(customer)}?`)) {
    return;
  }

  try {
    setStatus("DELETE request in progress...");
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Could not delete customer");
    }

    if (customerIdInput.value === customerId) {
      resetForm();
    }

    await loadDashboard();
    setStatus("Customer deleted successfully.");
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
}

function selectCustomer(customer) {
  customerIdInput.value = getCustomerKey(customer);
  fields.name.value = customer.name || customer.fullName || "";
  fields.email.value = customer.email || "";
  fields.age.value = customer.age ?? "";
  fields.type.value = customer.type || "Normal";
  fields.discount.value = customer.discount ?? "";
  fields.moneySpent.value = customer.moneySpent ?? customer.totalSale ?? "";
  formTitle.textContent = "Edit Customer";
  modePill.textContent = "PUT";
  submitBtn.textContent = "Save Changes";
  deleteBtn.disabled = false;
  setStatus(`Editing ${getCustomerName(customer)}.`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  customerForm.reset();
  customerIdInput.value = "";
  fields.type.value = "Normal";
  formTitle.textContent = "New Customer";
  modePill.textContent = "POST";
  submitBtn.textContent = "Create Customer";
  deleteBtn.disabled = true;
  setStatus("");
}

function getFormPayload() {
  const moneySpent = fields.moneySpent.value === "" ? 0 : Number(fields.moneySpent.value);

  return {
    name: fields.name.value.trim(),
    fullName: fields.name.value.trim(),
    email: fields.email.value.trim(),
    age: fields.age.value === "" ? undefined : Number(fields.age.value),
    type: fields.type.value,
    discount: fields.discount.value === "" ? 0 : Number(fields.discount.value),
    moneySpent,
    totalSale: moneySpent
  };
}

function getCustomerKey(customer) {
  return String(customer?._id || customer?.id || "");
}

function getCustomerName(customer) {
  return customer?.name || customer?.fullName || customer?.email || `customer ${customer?.id || ""}`.trim();
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatHeader(column) {
  return column
    .replace(/^_id$/, "Mongo ID")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(column, value) {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }

  if (column === "moneySpent" || column === "totalSale") {
    return formatMoney(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function setStatus(message, isError = false) {
  formStatus.textContent = message;
  formStatus.classList.toggle("error", isError);
}
