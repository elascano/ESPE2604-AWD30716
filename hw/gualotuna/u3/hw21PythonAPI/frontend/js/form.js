const supplyForm = document.getElementById('supplyForm');
const formTitle = document.getElementById('formTitle');
const supplyNameInput = document.getElementById('supplyName');
const quantityInput = document.getElementById('quantity');
const unitCostInput = document.getElementById('unitCost');
const orderDateInput = document.getElementById('orderDate');
const expirationDateInput = document.getElementById('expirationDate');

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get('id');

async function checkEditMode() {
  if (!editId) return;

  formTitle.textContent = 'Edit Supply';

  try {
    const item = await api.getSupplyById(editId);
    if (item) {
      supplyNameInput.value = item.supplyName;
      quantityInput.value = item.quantity;
      unitCostInput.value = item.unitCost;
      orderDateInput.value = item.orderDate.split('T')[0];
      expirationDateInput.value = item.expirationDate.split('T')[0];
    }
  } catch (error) {
    console.error(error);
    alert('Error loading data');
  }
}

async function saveSupply(event) {
  event.preventDefault();

  const payload = {
    supplyName: supplyNameInput.value,
    quantity: parseInt(quantityInput.value),
    unitCost: parseFloat(unitCostInput.value),
    orderDate: orderDateInput.value,
    expirationDate: expirationDateInput.value
  };

  try {
    if (editId) {
      await api.updateSupply(editId, payload);
    } else {
      await api.createSupply(payload);
    }
    window.location.href = 'index.html';
  } catch (error) {
    console.error(error);
    alert('Error saving data');
  }
}

supplyForm.addEventListener('submit', saveSupply);
document.addEventListener('DOMContentLoaded', checkEditMode);
