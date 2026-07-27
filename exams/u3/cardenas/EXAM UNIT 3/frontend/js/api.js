const API_BASE_URL = 'http://34.56.198.238:3000/fabuladental';

const api = {
  async getAllSupplies() {
    const response = await fetch(`${API_BASE_URL}/supplies`);
    return response.json();
  },

  async getSuppliesByQuantity(maxQuantity) {
    const response = await fetch(`${API_BASE_URL}/supplies/quantity-thresholds/${maxQuantity}`);
    return response.json();
  },

  async getSuppliesByStatus(status) {
    const response = await fetch(`${API_BASE_URL}/supplies/statuses/${status}`);
    return response.json();
  },

  async getSupplyById(id) {
    const supplies = await this.getAllSupplies();
    return supplies.find(item => item.id === parseInt(id));
  },

  async createSupply(data) {
    const response = await fetch(`${API_BASE_URL}/supply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async updateSupply(id, data) {
    const response = await fetch(`${API_BASE_URL}/supplies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async deleteSupply(id) {
    const response = await fetch(`${API_BASE_URL}/supplies/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
