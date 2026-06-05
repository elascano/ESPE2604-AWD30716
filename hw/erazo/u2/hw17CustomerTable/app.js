const API_BASE_URL = "/computerstore";

const customerTableBody = document.getElementById("customerTableBody");
const customerTableHead = document.getElementById("customerTableHead");
const totalSpentSpan = document.getElementById("totalSpent");
const statusText = document.getElementById("statusText");
const preferredColumns = ["id", "name", "email", "age", "type", "discount", "moneySpent", "totalSale", "_id"];

document.addEventListener("DOMContentLoaded", async () => {
  await loadCustomers();
  await loadTotalSpent();
});

async function loadCustomers() {
  try {
    statusText.textContent = "Loading";
    const response = await fetch(`${API_BASE_URL}/customers`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const customers = await response.json();
    customerTableBody.innerHTML = "";

    if (!Array.isArray(customers) || customers.length === 0) {
      customerTableHead.innerHTML = "<th>Customers</th>";
      customerTableBody.innerHTML = '<tr><td colspan="3" class="message">No customers found in the database.</td></tr>';
      statusText.textContent = "Empty";
      return;
    }

    const columns = getColumns(customers);
    customerTableHead.innerHTML = columns.map((column) => `<th>${formatHeader(column)}</th>`).join("");
    const fragment = document.createDocumentFragment();

    customers.forEach((customer) => {
      const row = document.createElement("tr");

      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.textContent = formatValue(column, customer[column]);

        if (column === "moneySpent" || column === "totalSale") {
          cell.className = "money";
        }

        row.appendChild(cell);
      });

      fragment.appendChild(row);
    });

    customerTableBody.appendChild(fragment);
    statusText.textContent = `${customers.length} Loaded`;
  } catch (error) {
    console.error(error);
    customerTableBody.innerHTML = '<tr><td colspan="3" class="message error">Could not get the customers. Check that the server is running and connected to MongoDB.</td></tr>';
    statusText.textContent = "Error";
  }
}

async function loadTotalSpent() {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/totalSpent`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    totalSpentSpan.textContent = Number(data.total || 0).toFixed(2);
  } catch (error) {
    console.error(error);
    totalSpentSpan.textContent = "0.00";
  }
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getColumns(customers) {
  const keys = new Set();

  customers.forEach((customer) => {
    Object.keys(customer).forEach((key) => {
      if (key !== "__v") {
        keys.add(key);
      }
    });
  });

  const ordered = preferredColumns.filter((column) => keys.has(column));
  const extra = [...keys].filter((column) => !preferredColumns.includes(column)).sort();
  return [...ordered, ...extra];
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
