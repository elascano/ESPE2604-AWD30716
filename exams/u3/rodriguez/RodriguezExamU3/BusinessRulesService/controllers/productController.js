const dbServiceUrl = process.env.DB_SERVICE_URL || "http://localhost:3016";

class ProductController {
  validate(data) {
    if (data.name !== undefined && !data.name) {
      throw new Error("Product name is required");
    }
    if (data.price !== undefined && data.price < 0) {
      throw new Error("Price cannot be negative");
    }
    if (data.expiration_day !== undefined && (data.expiration_day < 1 || data.expiration_day > 31)) {
      throw new Error("Expiration day must be between 1 and 31");
    }
    if (data.expiration_month !== undefined && (data.expiration_month < 1 || data.expiration_month > 12)) {
      throw new Error("Expiration month must be between 1 and 12");
    }
    if (data.expiration_year !== undefined && data.expiration_year < 2000) {
      throw new Error("Expiration year must be valid");
    }
  }

  calculateFields(data) {
    if (!data) return data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(Number(data.expiration_year), Number(data.expiration_month) - 1, Number(data.expiration_day));
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    data.days_left = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    data.iva_amount = Number((data.price * 0.19).toFixed(2));
    return data;
  }

  async getAll(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db`);
      if (!response.ok) return res.status(response.status).json({ message: "DB Service error" });
      const items = await response.json();
      const formatted = items.map(item => module.exports.calculateFields(item));
      res.json(formatted);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getListCalculation(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db`);
      if (!response.ok) return res.status(response.status).json({ message: "DB Service error" });
      const items = await response.json();
      const formatted = items.map(item => module.exports.calculateFields(item));
      res.json(formatted);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db/${req.params.id}`);
      if (response.status === 404) return res.status(404).json({ message: "Not found" });
      if (!response.ok) return res.status(response.status).json({ message: "DB Service error" });
      const item = await response.json();
      res.json(module.exports.calculateFields(item));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      module.exports.validate(req.body);
      const itemData = { ...req.body };
      module.exports.calculateFields(itemData);
      
      const response = await fetch(`${dbServiceUrl}/db`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message || "DB Service error" });
      }
      const savedItem = await response.json();
      res.status(201).json(module.exports.calculateFields(savedItem));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const getRes = await fetch(`${dbServiceUrl}/db/${req.params.id}`);
      if (getRes.status === 404) return res.status(404).json({ message: "Not found" });
      if (!getRes.ok) return res.status(getRes.status).json({ message: "DB Service error" });
      
      const currentItem = await getRes.json();
      const mergedData = { ...currentItem, ...req.body };
      
      module.exports.validate(mergedData);
      module.exports.calculateFields(mergedData);
      
      const response = await fetch(`${dbServiceUrl}/db/${req.params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message || "DB Service error" });
      }
      const updatedItem = await response.json();
      res.json(module.exports.calculateFields(updatedItem));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db/${req.params.id}`, { method: "DELETE" });
      if (response.status === 404) return res.status(404).json({ message: "Not found" });
      if (!response.ok) return res.status(response.status).json({ message: "DB Service error" });
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ProductController();
