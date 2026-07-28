const productsContainer = document.getElementById('products');
const cartList = document.getElementById('cart-list');
const totalEl = document.getElementById('total');
const clearCartBtn = document.getElementById('clear-cart');


async function loadProducts() {
  const res = await fetch(`${CONFIG.API_URL}/products`);
  const products = await res.json(); // array of product objects

  productsContainer.innerHTML = products.map((product) => `
    <div class="card">
      <h4>${product.name}</h4>
      <img src="${product.image}" alt="${product.name}">
      <button class="price-pill" onclick="addToCart(${product.id})">$${product.price.toFixed(2)}</button>
      <a class="info-link" href="product.html?id=${product.id}">Info</a>
    </div>
  `).join('');
}


async function addToCart(id) {
  const res = await fetch(`${CONFIG.API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  renderCart(data.cart, data.total);
}


async function loadCart() {
  const res = await fetch(`${CONFIG.API_URL}/cart`);
  const data = await res.json();
  renderCart(data.cart, data.total);
}

function renderCart(cart, total) {
  cartList.innerHTML = cart.map((item) => `
    <li><span>${item.name}</span><span>$${item.price.toFixed(2)}</span></li>
  `).join('');
  totalEl.textContent = total.toFixed(2);
}

clearCartBtn.addEventListener('click', async () => {
  const res = await fetch(`${CONFIG.API_URL}/cart`, { method: 'DELETE' });
  const data = await res.json();
  renderCart(data.cart, data.total);
});

loadProducts();
loadCart();
