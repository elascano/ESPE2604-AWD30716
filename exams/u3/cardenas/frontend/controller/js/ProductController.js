class ProductController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    this.setupEventListeners();
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const products = await this.model.fetchProducts();
      this.view.renderTable(products);
    } catch (error) {
      console.error(error);
      alert('Error fetching products');
    }
  }

  setupEventListeners() {
    this.view.searchNameInput.addEventListener('input', () => this.handleFilter());
    
    this.view.suppliesTableBody.addEventListener('click', (event) => this.handleTableClick(event));
    this.view.cartItemsList.addEventListener('click', (event) => this.handleCartClick(event));
    
    this.view.calculateCartTotalBtn.addEventListener('click', () => this.handleCalculateCartTotal());
    this.view.clearCartBtn.addEventListener('click', () => this.handleClearCart());
    
    this.view.getIvaBtn.addEventListener('click', () => this.handleIvaLookup());
    this.view.getDaysLeftBtn.addEventListener('click', () => this.handleDaysLeftLookup());
  }

  handleFilter() {
    const searchTerm = this.view.searchNameInput.value.toLowerCase().trim();
    const filtered = this.model.productsList.filter(item => {
      const name = item.name || '';
      return name.toLowerCase().includes(searchTerm);
    });
    this.view.renderTable(filtered);
  }

  handleTableClick(event) {
    if (event.target && event.target.classList.contains('add-to-cart-btn')) {
      const name = event.target.getAttribute('data-name');
      const price = parseFloat(event.target.getAttribute('data-price'));
      this.model.addToCart({ name, price });
      this.view.renderCart(this.model.cartList);
    }
  }

  handleCartClick(event) {
    if (event.target && event.target.classList.contains('remove-cart-item-btn')) {
      event.preventDefault();
      const index = parseInt(event.target.getAttribute('data-index'));
      this.model.removeFromCart(index);
      this.view.renderCart(this.model.cartList);
      this.view.renderCartTotal(0);
    }
  }

  async handleCalculateCartTotal() {
    if (this.model.cartList.length === 0) {
      alert('Your cart is empty');
      return;
    }
    try {
      const total = await this.model.calculateCartTotal();
      this.view.renderCartTotal(total);
    } catch (error) {
      console.error(error);
      alert('Error calculating total');
    }
  }

  handleClearCart() {
    this.model.clearCart();
    this.view.renderCart(this.model.cartList);
    this.view.renderCartTotal(0);
  }

  async handleIvaLookup() {
    const name = this.view.ivaSearchNameInput.value.trim();
    if (!name) {
      alert('Please enter a product name');
      return;
    }
    try {
      const iva = await this.model.getProductIva(name);
      this.view.renderIva(iva);
    } catch (error) {
      console.error(error);
      this.view.renderIvaError();
    }
  }

  async handleDaysLeftLookup() {
    const name = this.view.expSearchNameInput.value.trim();
    const day = this.view.expDayInput.value.trim();
    const month = this.view.expMonthInput.value.trim();
    const year = this.view.expYearInput.value.trim();

    if (!name) {
      alert('Please enter a product name');
      return;
    }

    try {
      let days;
      if (day || month || year) {
        if (!day || !month || !year) {
          alert('To calculate using day, month, and year, all three fields must be filled.');
          return;
        }
        days = await this.model.getProductLeftDays(name, parseInt(day), parseInt(month), parseInt(year));
      } else {
        days = await this.model.getProductLeftDays(name);
      }
      this.view.renderDaysLeft(days);
    } catch (error) {
      console.error(error);
      this.view.renderDaysLeftError();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const model = new ProductModel();
  const view = new ProductListView();
  const controller = new ProductController(model, view);
  controller.init();
});
