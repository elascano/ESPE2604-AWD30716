// Configuration - set the backend endpoint URL
// In development, this is localhost. In production, update this to your Azure API URL.
const BACKEND_URL = "https://exam3-backend-api-ajs.azurewebsites.net";

// DOM Elements
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

// Cart Elements
const addForm = document.getElementById("add-product-form");
const cartList = document.getElementById("cart-list");
const productCount = document.getElementById("product-count");
const totalPrice = document.getElementById("total-price");
const btnClear = document.getElementById("btn-clear");

// IVA Elements
const ivaForm = document.getElementById("iva-form");
const ivaSearchName = document.getElementById("iva-search-name");
const ivaResultBox = document.getElementById("iva-result-box");

// Expiration Elements
const expirationForm = document.getElementById("expiration-form");
const expirationSearchName = document.getElementById("expiration-search-name");
const expirationResultBox = document.getElementById("expiration-result-box");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  checkBackendStatus();
  fetchProducts();
});

// Helper: check backend online status
async function checkBackendStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (response.ok) {
      statusDot.className = "status-dot green";
      statusText.textContent = "Backend Online";
    } else {
      throw new Error("Offline");
    }
  } catch (error) {
    statusDot.className = "status-dot red";
    statusText.textContent = "Backend Offline";
    console.error("Health check failed:", error);
  }
}

// Fetch all products from the backend API and update UI
async function fetchProducts() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/products`);
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    updateCartUI(data.products, data.total);
  } catch (error) {
    console.error("Error fetching products:", error);
    showTableError();
  }
}

// Update the shopping cart table UI
function updateCartUI(products, total) {
  productCount.textContent = products.length;
  totalPrice.textContent = `$${parseFloat(total).toFixed(2)}`;

  if (products.length === 0) {
    cartList.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">No products added. Add products on the left.</td>
      </tr>
    `;
    return;
  }

  cartList.innerHTML = products.map(product => {
    const dateStr = `${String(product.expirationDate.day).padStart(2, '0')}/${String(product.expirationDate.month).padStart(2, '0')}/${product.expirationDate.year}`;
    return `
      <tr>
        <td>${escapeHtml(product.name)}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${dateStr}</td>
      </tr>
    `;
  }).join("");
}

// Show error inside table in case of API failure
function showTableError() {
  cartList.innerHTML = `
    <tr>
      <td colspan="3" class="empty-state" style="color: var(--danger)">
        Failed to sync with backend. Please ensure the server is running.
      </td>
    </tr>
  `;
}

// Add product Form submission
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("add-name");
  const priceInput = document.getElementById("add-price");
  const dayInput = document.getElementById("add-day");
  const monthInput = document.getElementById("add-month");
  const yearInput = document.getElementById("add-year");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  // Validate inputs
  if (!name || isNaN(price) || isNaN(day) || isNaN(month) || isNaN(year)) {
    alert("Please fill all fields with valid information.");
    return;
  }

  // Validate logical date numbers
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2026 || year > 2100) {
    alert("Please input a valid date (DD: 1-31, MM: 1-12, YYYY: 2026-2100).");
    return;
  }

  const payload = {
    name,
    price,
    expirationDate: { day, month, year }
  };

  try {
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add product");
    }

    // Reset inputs
    nameInput.value = "";
    priceInput.value = "";
    dayInput.value = "";
    monthInput.value = "";
    yearInput.value = "";

    // Refresh lists and status
    fetchProducts();
    checkBackendStatus();

  } catch (error) {
    alert(error.message);
  }
});

// Clear Cart button handler
btnClear.addEventListener("click", async () => {
  if (confirm("Are you sure you want to clear the shopping cart?")) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/reset`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  }
});

// Find Product and Compute IVA
ivaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchName = ivaSearchName.value.trim();
  if (!searchName) return;

  try {
    const response = await fetch(`${BACKEND_URL}/api/products/${encodeURIComponent(searchName)}/iva`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Product not found");
    }

    ivaResultBox.innerHTML = `
      <div class="result-data">
        <div class="result-row">
          <span class="result-label">Product:</span>
          <span class="result-val">${escapeHtml(data.name)}</span>
        </div>
        <div class="result-row">
          <span class="result-label">Base Price:</span>
          <span class="result-val">$${data.price.toFixed(2)}</span>
        </div>
        <div class="result-row">
          <span class="result-label">IVA Rate:</span>
          <span class="result-val">${data.ivaRate}</span>
        </div>
        <div class="result-row">
          <span class="result-label">IVA Amount:</span>
          <span class="result-val highlight-val">$${data.ivaAmount.toFixed(2)}</span>
        </div>
      </div>
    `;
  } catch (error) {
    ivaResultBox.innerHTML = `
      <div class="result-placeholder" style="color: var(--danger)">
        Error: ${escapeHtml(error.message)}
      </div>
    `;
  }
});

// Find Product and Compute Expiration
expirationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchName = expirationSearchName.value.trim();
  if (!searchName) return;

  try {
    const response = await fetch(`${BACKEND_URL}/api/products/${encodeURIComponent(searchName)}/expiration`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Product not found");
    }

    const { daysLeft } = data;
    let badgeClass = "badge-success";
    let badgeText = `${daysLeft} days remaining`;

    if (daysLeft <= 0) {
      badgeClass = "badge-danger";
      badgeText = `Expired (${Math.abs(daysLeft)} days ago)`;
    } else if (daysLeft <= 7) {
      badgeClass = "badge-warning";
      badgeText = `${daysLeft} days left (Expiring soon!)`;
    }

    const dateStr = `${String(data.expirationDate.day).padStart(2, '0')}/${String(data.expirationDate.month).padStart(2, '0')}/${data.expirationDate.year}`;

    expirationResultBox.innerHTML = `
      <div class="result-data">
        <div class="result-row">
          <span class="result-label">Product:</span>
          <span class="result-val">${escapeHtml(data.name)}</span>
        </div>
        <div class="result-row">
          <span class="result-label">Expiration Date:</span>
          <span class="result-val">${dateStr}</span>
        </div>
        <div class="result-row">
          <span class="result-label">Status:</span>
          <span><span class="badge ${badgeClass}">${badgeText}</span></span>
        </div>
      </div>
    `;
  } catch (error) {
    expirationResultBox.innerHTML = `
      <div class="result-placeholder" style="color: var(--danger)">
        Error: ${escapeHtml(error.message)}
      </div>
    `;
  }
});

// Simple helper to avoid HTML injections
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
