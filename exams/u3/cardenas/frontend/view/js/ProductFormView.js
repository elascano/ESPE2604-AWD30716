class ProductFormView {
  constructor() {
    this.supplyForm = document.getElementById('supplyForm');
    this.priceInput = document.getElementById('price');
    this.nameInput = document.getElementById('name');
    this.expDayInput = document.getElementById('expDay');
    this.expMonthInput = document.getElementById('expMonth');
    this.expYearInput = document.getElementById('expYear');
  }

  getFormData() {
    return {
      name: this.nameInput.value.trim(),
      price: parseFloat(this.priceInput.value),
      day: parseInt(this.expDayInput.value),
      month: parseInt(this.expMonthInput.value),
      year: parseInt(this.expYearInput.value)
    };
  }
}
