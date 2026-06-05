const API_BASE = "/computerstore";

const customersBody = document.getElementById("customers-body");
const totalEarned = document.getElementById("total-earned");
const totalEarnedTop = document.getElementById("total-earned-top");
const refreshBtn = document.getElementById("refresh-btn");
const statusEl = document.getElementById("form-status");

const formatMoney = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
};

const setStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  if (message) {
    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.classList.remove("error");
    }, 3000);
  }
};

const renderCustomers = (customers) => {
  customersBody.innerHTML = "";

  customers.forEach((customer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${customer.id ?? ""}</td>
      <td>${customer.fullName || customer.name || ""}</td>
      <td>${customer.email ?? ""}</td>
      <td>${customer.type ?? ""}</td>
      <td>${customer.discount ?? ""}</td>
      <td>${formatMoney(customer.totalSale || customer.moneySpent)}</td>
    `;
    customersBody.appendChild(row);
  });
};

const fetchCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE}/customers`);
    if (!response.ok) {
      throw new Error("Unable to load customers");
    }
    const customers = await response.json();
    renderCustomers(customers);
    fetchTotal();
  } catch (error) {
    setStatus(error.message, true);
  }
};

const fetchTotal = async () => {
  try {
    const response = await fetch(`${API_BASE}/customers/total`);
    if (!response.ok) {
      throw new Error("Unable to load total");
    }
    const data = await response.json();
    const formatted = formatMoney(data.total);
    totalEarned.textContent = formatted;
    if (totalEarnedTop) {
      totalEarnedTop.textContent = formatted;
    }
  } catch (error) {
    setStatus(error.message, true);
  }
};

refreshBtn.addEventListener("click", fetchCustomers);
fetchCustomers();
