const API_BASE_URL = "http://TU_IP_O_DOMINIO_BACKEND:3000";

// --- Cart state. Never mutated directly, only replaced. ---
let cart = [];

// ------------------------------------------------------------------
// CONCEPT 1: NON-BLOCKING Programming
// ------------------------------------------------------------------
// sleep() does not block the browser: it returns a Promise that the event
// loop resolves later, leaving the thread free in the meantime.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingServer(label) {
  const t0 = performance.now();
  await fetch(`${API_BASE_URL}/api/ping`);
  const elapsed = (performance.now() - t0).toFixed(0);
  logLine(`  🏓 ping ${label} responded in ${elapsed} ms`);
}

async function runComparison(blocking) {
  clearLog();
  const endpoint = blocking ? "/api/menu-blocking" : "/api/menu";
  logLine(`Requesting menu (${blocking ? "BLOCKING" : "NON-BLOCKING"})...`);

  const t0 = performance.now();

  // The menu request and the "pings" go out almost at the same time.
  // If the backend blocks the event loop, the pings will be trapped
  // behind that request. If it doesn't block, the pings fly.
  const menuPromise = fetch(`${API_BASE_URL}${endpoint}`)
    .then((res) => res.json())
    .then((data) => {
      const elapsed = (performance.now() - t0).toFixed(0);
      logLine(`✅ Menu received in ${elapsed} ms`);
      renderMenu(data.items);
    });

  const pingPromises = [0, 300, 600].map((delayMs, i) =>
    sleep(delayMs).then(() => pingServer(`#${i + 1}`))
  );

  await Promise.all([menuPromise, ...pingPromises]);
  logLine("--- end of comparison ---");
}

function clearLog() {
  document.getElementById("log").textContent = "";
}

function logLine(text) {
  const log = document.getElementById("log");
  log.textContent += text + "\n";
}

// ------------------------------------------------------------------
// DECLARATIVE Rendering: this function only paints what it receives,
// it doesn't decide business rules nor mutates external data.
// ------------------------------------------------------------------
function renderMenu(items) {
  const container = document.getElementById("menu");
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = '<p class="hint">No dishes available.</p>';
    return;
  }

  items.forEach((item) => {
    const el = document.createElement("div");
    el.className = "menu-item";
    el.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span class="category">${item.category} · $${item.price.toFixed(2)}</span>
      </div>
      <button class="add-btn">Add</button>
    `;
    el.querySelector(".add-btn").addEventListener("click", () => addToCart(item));
    container.appendChild(el);
  });
}

// ------------------------------------------------------------------
// CONCEPT 2: State immutability
// ------------------------------------------------------------------
function addToCart(item) {
  // NEVER: cart.push(item)  -> would mutate the original array
  // ALWAYS: generate a new copy
  cart = [...cart, item];
  renderCart();
}

function removeFromCart(index) {
  // We also don't use splice(); filter() returns a new array
  cart = cart.filter((_, i) => i !== index);
  renderCart();
}

// ------------------------------------------------------------------
// CONCEPT 3: Pure and deterministic function
// ------------------------------------------------------------------
// Given the same `items` array, calculateTotal ALWAYS returns the
// same number. It does not read or modify anything outside its parameters.
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = '<li class="hint">Empty cart</li>';
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} &mdash; $${item.price.toFixed(2)}</span>
        <button class="remove-btn">✕</button>
      `;
      li.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(index));
      list.appendChild(li);
    });
  }

  document.getElementById("total").textContent = `$${calculateTotal(cart).toFixed(2)}`;
}

// ------------------------------------------------------------------
// Initial bindings
// ------------------------------------------------------------------
document.getElementById("btn-blocking").addEventListener("click", () => runComparison(true));
document.getElementById("btn-nonblocking").addEventListener("click", () => runComparison(false));
renderCart();
