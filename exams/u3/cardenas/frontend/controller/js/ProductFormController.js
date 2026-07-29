class ProductFormController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.supplyForm.addEventListener('submit', (event) => this.handleFormSubmit(event));
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    const productPayload = this.view.getFormData();
    try {
      await this.model.createProduct(productPayload);
      window.location.href = 'index.html';
    } catch (error) {
      console.error(error);
      alert('Error saving product: ' + error.message);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const model = new ProductModel();
  const view = new ProductFormView();
  const controller = new ProductFormController(model, view);
  controller.init();
});
