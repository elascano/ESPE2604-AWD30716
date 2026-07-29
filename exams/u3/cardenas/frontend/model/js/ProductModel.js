const API_BASE_URL = `http://${window.location.hostname || 'localhost'}:3004/andresflashdrivebusiness`;

class ProductModel {
  constructor() {
    this.productsList = [];
    this.cartList = [];
  }

  async fetchProducts() {
    const response = await fetch(`${API_BASE_URL}/flashes`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    this.productsList = await response.json();
    return this.productsList;
  }

  async createProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/flashes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  }

  async calculateCartTotal() {
    if (this.cartList.length === 0) {
      return 0;
    }
    const response = await fetch(`${API_BASE_URL}/flashes/cart/total`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: this.cartList })
    });
    if (!response.ok) {
      throw new Error('Failed to calculate cart total');
    }
    const data = await response.json();
    return data.totalPrice;
  }

  async getProductIva(name) {
    const response = await fetch(`${API_BASE_URL}/flashes/IVA/${name}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();
    return data.iva;
  }

  async getProductLeftDays(name, day, month, year) {
    let url = `${API_BASE_URL}/flashes/leftDays/${name}`;
    if (day && month && year) {
      url += `?day=${day}&month=${month}&year=${year}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();
    return data.leftDays;
  }

  addToCart(product) {
    this.cartList.push(product);
  }

  removeFromCart(index) {
    this.cartList.splice(index, 1);
  }

  clearCart() {
    this.cartList = [];
  }
}
