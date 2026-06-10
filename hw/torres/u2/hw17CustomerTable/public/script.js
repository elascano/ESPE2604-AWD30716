const API_BASE = "/customerStore";

const elements = {
  totalCustomers: document.getElementById("total-customers"),
  totalRevenue: document.getElementById("total-revenue"),
  apiStatus: document.getElementById("api-status"),
  customersBody: document.getElementById("customers-body"),
  rowCount: document.getElementById("row-count"),
  searchType: document.getElementById("search-type"),
  searchInput: document.getElementById("search-input"),
  searchBtn: document.getElementById("search-btn"),
  clearBtn: document.getElementById("clear-btn"),
  refreshBtn: document.getElementById("refresh-btn"),
  searchResults: document.getElementById("search-results")
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

document.addEventListener("DOMContentLoaded", () => {
  elements.refreshBtn.addEventListener("click", refresh);
  elements.searchBtn.addEventListener("click", searchCustomer);
  elements.clearBtn.addEventListener("click", clearSearch);
  elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchCustomer();
    }
  });

  refresh();
});

async function refresh() {
  await Promise.all([checkHealth(), loadStats(), loadCustomers()]);
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    elements.apiStatus.textContent = response.ok ? "Online" : "Error";
  } catch {
    elements.apiStatus.textContent = "Offline";
  }
}

async function loadStats() {
  try {
    const [countResponse, revenueResponse] = await Promise.all([
      fetch(`${API_BASE}/customer/count`),
      fetch(`${API_BASE}/customer/revenue`)
    ]);

    const count = await countResponse.json();
    const revenue = await revenueResponse.json();

    elements.totalCustomers.textContent = count.total ?? 0;
    elements.totalRevenue.textContent = moneyFormatter.format(revenue.total ?? 0);
  } catch {
    elements.totalCustomers.textContent = "Error";
    elements.totalRevenue.textContent = "Error";
  }
}

async function loadCustomers() {
  elements.customersBody.innerHTML = row("Loading customers...", 4);

  try {
    const response = await fetch(`${API_BASE}/customer`);
    const customers = await response.json();
    renderCustomers(customers);
  } catch {
    elements.customersBody.innerHTML = row("Error connecting to the customer API.", 4);
    elements.rowCount.textContent = "0 rows";
  }
}

function renderCustomers(customers) {
  if (!Array.isArray(customers) || customers.length === 0) {
    elements.customersBody.innerHTML = row("No customers found.", 4);
    elements.rowCount.textContent = "0 rows";
    return;
  }

  elements.customersBody.innerHTML = customers
    .map((customer) => {
      const moneySpent = Number(customer.moneySpent || 0);
      return `
        <tr>
          <td>${escapeHtml(customer.id ?? "-")}</td>
          <td>${escapeHtml(customer.name ?? "Unnamed")}</td>
          <td>${escapeHtml(customer.age ?? "-")}</td>
          <td class="money">${moneyFormatter.format(moneySpent)}</td>
        </tr>
      `;
    })
    .join("");

  elements.rowCount.textContent = `${customers.length} rows`;
}

async function searchCustomer() {
  const type = elements.searchType.value;
  const value = elements.searchInput.value.trim();

  if (!value) {
    showResult("Enter a value before searching.", true);
    return;
  }

  showResult("Searching...", false);

  try {
    const response = await fetch(`${API_BASE}/customer/${type}/${encodeURIComponent(value)}`);

    if (!response.ok) {
      showResult("No customer found for that search.", true);
      return;
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      renderSearchList(data);
      return;
    }

    showResult(customerDetail(data), false);
  } catch {
    showResult("Error performing the search.", true);
  }
}

function renderSearchList(customers) {
  if (customers.length === 0) {
    showResult("No customers found for that search.", true);
    return;
  }

  const items = customers.map((customer) => customerDetail(customer)).join("<hr>");
  showResult(items, false);
}

function customerDetail(customer) {
  return `
    <strong>${escapeHtml(customer.name ?? "Unnamed")}</strong><br>
    ID: ${escapeHtml(customer.id ?? "-")}<br>
    Age: ${escapeHtml(customer.age ?? "-")}<br>
    Money Spent: ${moneyFormatter.format(Number(customer.moneySpent || 0))}
  `;
}

function showResult(content, isError) {
  elements.searchResults.innerHTML = content;
  elements.searchResults.classList.toggle("error", isError);
  elements.searchResults.classList.remove("hidden");
}

function clearSearch() {
  elements.searchInput.value = "";
  elements.searchResults.innerHTML = "";
  elements.searchResults.className = "result hidden";
}

function row(message, colspan) {
  return `<tr><td colspan="${colspan}" class="empty">${message}</td></tr>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
