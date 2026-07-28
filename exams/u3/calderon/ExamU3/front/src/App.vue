<script setup>
import { ref, onMounted, watch } from 'vue';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://examback-calderon.duckdns.org';

const activeTab = ref('search'); // 'search' or 'cart'

const products = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const error = ref(null);

const cart = ref([]);
const cartTotals = ref({ subtotal: 0, ivaTotal: 0, total: 0 });

const ivaResult = ref(null); // { productName, price, ivaAmount, ivaRate }
const expiryProduct = ref(null); // { id, name }
const expiryInputs = ref({ day: '', month: '', year: '' });
const expiryResult = ref(null); // { daysLeft, status, expirationDate }

onMounted(() => {
  fetchProducts();
});

watch(cart, () => {
  calculateCartTotals();
}, { deep: true });

async function fetchProducts(query = '') {
  loading.value = true;
  error.value = null;
  try {
    const url = query 
      ? `${API_BASE_URL}/api/products?q=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/api/products`;
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products from backend API.');
    }
    const data = await response.json();
    products.value = data;
  } catch (err) {
    console.error(err);
    error.value = err.message || 'Could not connect to the backend server.';
  } finally {
    loading.value = false;
  }
}

function handleSearchSubmit() {
  fetchProducts(searchQuery.value);
}

function handleClearSearch() {
  searchQuery.value = '';
  fetchProducts('');
}

async function handleCalculateIva(product) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/calculate-iva`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id })
    });
    if (!response.ok) {
      throw new Error('Failed to calculate IVA');
    }
    const data = await response.json();
    ivaResult.value = {
      productName: product.name,
      price: data.price,
      ivaAmount: data.ivaAmount,
      ivaRate: data.ivaRate
    };
  } catch (err) {
    alert(`Error calculating IVA: ${err.message}`);
  }
}

// Feature 3: Open expiration inputs for a product
function handleOpenExpiry(product) {
  expiryProduct.value = product;
  const today = new Date();
  expiryInputs.value = {
    day: today.getDate().toString(),
    month: (today.getMonth() + 1).toString(),
    year: today.getFullYear().toString()
  };
  expiryResult.value = null;
}

// Feature 3: Compute expiration time on backend
async function handleCalculateExpiration() {
  if (!expiryProduct.value) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/calculate-expiration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: parseInt(expiryInputs.value.day, 10),
        month: parseInt(expiryInputs.value.month, 10),
        year: parseInt(expiryInputs.value.year, 10)
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to calculate expiration time');
    }

    const data = await response.json();
    expiryResult.value = data;
  } catch (err) {
    alert(`Error calculating expiration: ${err.message}`);
  }
}

// Feature 1: Add product to shopping cart
function handleAddToCart(product) {
  const existing = cart.value.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
}

// Update item quantity in cart
function handleUpdateQuantity(productId, change) {
  const item = cart.value.find((item) => item.id === productId);
  if (item) {
    const newQty = item.quantity + change;
    if (newQty > 0) {
      item.quantity = newQty;
    } else {
      handleRemoveFromCart(productId);
    }
  }
}

// Remove item from cart
function handleRemoveFromCart(productId) {
  cart.value = cart.value.filter((item) => item.id !== productId);
}

// Feature 1: Call backend to compute totals
async function calculateCartTotals() {
  if (cart.value.length === 0) {
    cartTotals.value = { subtotal: 0, ivaTotal: 0, total: 0 };
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/calculate-total`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.value.map((item) => ({
          price: item.price,
          quantity: item.quantity
        }))
      })
    });

    if (!response.ok) {
      throw new Error('Failed to calculate cart totals');
    }

    const data = await response.json();
    cartTotals.value = {
      subtotal: data.subtotal,
      ivaTotal: data.ivaTotal,
      total: data.total
    };
  } catch (err) {
    console.error('Error calculating totals:', err);
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-brand">
        <h1>TechStore</h1>
      </div>
    </header>

    <!-- Tabs Selector -->
    <nav class="tab-navigation">
      <button 
        :class="['tab-btn', { active: activeTab === 'search' }]"
        @click="activeTab = 'search'"
      >
        Search Products
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'cart' }]"
        @click="activeTab = 'cart'"
      >
        Shopping Cart ({{ cart.reduce((sum, item) => sum + item.quantity, 0) }})
      </button>
    </nav>

    <!-- Main Content Area -->
    <main class="app-content">
      
      <!-- Tab 1: Search Products -->
      <div v-if="activeTab === 'search'" class="tab-pane">
        <div class="section-header">
          <h2>Computer Inventory</h2>
          <form @submit.prevent="handleSearchSubmit" class="search-form">
            <input 
              type="text" 
              placeholder="Search by model, brand or specs..."
              v-model="searchQuery"
              class="search-input"
            />
            <button type="submit" class="btn btn-primary">Search</button>
            <button 
              v-if="searchQuery" 
              type="button" 
              @click="handleClearSearch" 
              class="btn btn-secondary"
            >
              Clear
            </button>
          </form>
        </div>

        <div v-if="loading" class="loading-spinner">
          Loading products database...
        </div>

        <div v-else-if="error" class="error-card">
          <p>Error: {{ error }}</p>
          <button @click="fetchProducts(searchQuery)" class="btn btn-secondary btn-sm">Try Again</button>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <p>No computer products found matching "{{ searchQuery }}".</p>
          <button @click="handleClearSearch" class="btn btn-secondary btn-sm">Show All Products</button>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Specs & Description</th>
                <th>Price</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>#{{ product.id }}</td>
                <td class="font-semibold">{{ product.name }}</td>
                <td><span class="category-badge">{{ product.category }}</span></td>
                <td class="text-muted text-sm">{{ product.description }}</td>
                <td class="font-mono font-semibold">${{ product.price.toFixed(2) }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      @click="handleCalculateIva(product)"
                      class="btn btn-outline-info btn-xs"
                      title="Calculate 15% IVA for this item"
                    >
                      Calc IVA
                    </button>
                    <button 
                      @click="handleOpenExpiry(product)"
                      class="btn btn-outline-warning btn-xs"
                      title="Check expiration time remaining"
                    >
                      Check Expiry
                    </button>
                    <button 
                      @click="handleAddToCart(product)"
                      class="btn btn-success btn-xs"
                      title="Add item to shopping cart"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Popups/Modals Widgets -->
        <div class="calculator-widgets">
          <!-- IVA Result Widget -->
          <div v-if="ivaResult" class="widget-card info-card">
            <div class="widget-header">
              <h3>IVA Calculation Result</h3>
              <button class="close-btn" @click="ivaResult = null">&times;</button>
            </div>
            <div class="widget-body">
              <p><strong>Product:</strong> {{ ivaResult.productName }}</p>
              <p><strong>Base Price:</strong> ${{ ivaResult.price.toFixed(2) }}</p>
              <p><strong>IVA Rate:</strong> {{ (ivaResult.ivaRate * 100).toFixed(0) }}%</p>
              <p class="highlight-text"><strong>Calculated IVA Amount:</strong> ${{ ivaResult.ivaAmount.toFixed(2) }}</p>
            </div>
          </div>

          <!-- Expiration Calculator Widget -->
          <div v-if="expiryProduct" class="widget-card warning-card">
            <div class="widget-header">
              <h3>Check Expiration Time</h3>
              <button class="close-btn" @click="expiryProduct = null">&times;</button>
            </div>
            <form @submit.prevent="handleCalculateExpiration" class="widget-body">
              <p class="text-sm text-muted">Enter expiration date for <strong>{{ expiryProduct.name }}</strong> to calculate days left.</p>
              <div class="date-inputs">
                <div class="input-group">
                  <label>Day</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    required 
                    v-model="expiryInputs.day"
                  />
                </div>
                <div class="input-group">
                  <label>Month</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    required 
                    v-model="expiryInputs.month"
                  />
                </div>
                <div class="input-group">
                  <label>Year</label>
                  <input 
                    type="number" 
                    min="2026" 
                    max="2100" 
                    required 
                    v-model="expiryInputs.year"
                  />
                </div>
              </div>
              <button type="submit" class="btn btn-warning btn-sm w-full mt-3">Calculate Days Left</button>

              <div v-if="expiryResult" class="expiry-result-badge mt-3">
                <span v-if="expiryResult.status === 'expired'" class="badge-danger">
                  Expired {{ expiryResult.daysLeft }} days ago
                </span>
                <span v-else-if="expiryResult.status === 'expires today'" class="badge-warning">
                  Expires today!
                </span>
                <span v-else class="badge-success">
                  {{ expiryResult.daysLeft }} days left to sell
                </span>
                <p class="text-xs text-muted mt-1">Target date: {{ expiryResult.expirationDate }}</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Tab 2: Shopping Cart -->
      <div v-if="activeTab === 'cart'" class="tab-pane">
        <div class="section-header">
          <h2>Your Shopping Cart</h2>
          <button 
            @click="activeTab = 'search'" 
            class="btn btn-secondary btn-sm"
          >
            &larr; Back to Shop
          </button>
        </div>

        <div v-if="cart.length === 0" class="empty-cart-state">
          <p>Your shopping cart is currently empty.</p>
          <button @click="activeTab = 'search'" class="btn btn-primary">
            Browse Products
          </button>
        </div>

        <div v-else class="cart-grid">
          <!-- Cart Items Table -->
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th class="text-center">Quantity</th>
                  <th>IVA (15%)</th>
                  <th>Total</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart" :key="item.id">
                  <td class="font-semibold">{{ item.name }}</td>
                  <td class="font-mono">${{ item.price.toFixed(2) }}</td>
                  <td>
                    <div class="quantity-controls">
                      <button 
                        @click="handleUpdateQuantity(item.id, -1)"
                        class="qty-btn"
                      >
                        -
                      </button>
                      <span class="qty-value font-semibold">{{ item.quantity }}</span>
                      <button 
                        @click="handleUpdateQuantity(item.id, 1)"
                        class="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td class="font-mono text-muted">
                    ${{ (item.price * item.quantity * 0.15).toFixed(2) }}
                  </td>
                  <td class="font-mono font-semibold">
                    ${{ (item.price * item.quantity * 1.15).toFixed(2) }}
                  </td>
                  <td class="text-center">
                    <button 
                      @click="handleRemoveFromCart(item.id)"
                      class="btn btn-danger btn-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Cart Totals Summary -->
          <div class="cart-summary-card">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal (Before Tax)</span>
              <span class="font-mono">${{ cartTotals.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>IVA Tax (15%)</span>
              <span class="font-mono">${{ cartTotals.ivaTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row grand-total">
              <span>Total Cost</span>
              <span class="font-mono">${{ cartTotals.total.toFixed(2) }}</span>
            </div>
            
            <div class="checkout-note">
              <p>Total calculated in real-time by the backend API.</p>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} TechStore Computer Systems. All Rights Reserved.</p>
      <p class="text-xs text-muted">Built for Advanced Web Development Exam (Calderon)</p>
    </footer>
  </div>
</template>
