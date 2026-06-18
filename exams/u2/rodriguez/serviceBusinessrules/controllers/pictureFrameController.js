const dbServiceUrl = process.env.DB_SERVICE_URL || "http://localhost:3016";

class PictureFrameController {
  validate(data) {
    if (data.price !== undefined && Number(data.price) < 0) {
      throw new Error("Price cannot be negative");
    }
    if (data.serial !== undefined && !data.serial) {
      throw new Error("Serial is required");
    }
    if (data.brand !== undefined && !data.brand) {
      throw new Error("Brand is required");
    }
    if (data.model !== undefined && !data.model) {
      throw new Error("Model is required");
    }
  }

  calculateScore(data) {
    const itemDate = new Date(data.date);
    const refDate = new Date("2026-06-17");
    let diffDays = 0;
    if (!isNaN(itemDate.getTime())) {
      const diffTime = refDate - itemDate;
      diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    }
    const price = Number(data.price) || 0;
    let score = 10;
    score -= diffDays * 0.5;
    score -= price * 0.01;
    if (score < 1) {
      score = 1;
    }
    if (score > 10) {
      score = 10;
    }
    data.pice_time = Number(score.toFixed(2));
  }

  async getAll(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db/pictureFrame`);
      if (!response.ok) {
        return res.status(response.status).json({ message: "DB Service error" });
      }
      const items = await response.json();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db/pictureFrame/${req.params.id}`);
      if (response.status === 404) {
        return res.status(404).json({ message: "Not found" });
      }
      if (!response.ok) {
        return res.status(response.status).json({ message: "DB Service error" });
      }
      const item = await response.json();
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      this.validate(req.body);
      const itemData = {
        serial: req.body.serial,
        brand: req.body.brand,
        model: req.body.model,
        date: req.body.date,
        price: Number(req.body.price),
        description: req.body.description,
        is_new: req.body.is_new === true || req.body.is_new === "true"
      };
      this.calculateScore(itemData);
      const response = await fetch(`${dbServiceUrl}/db/pictureFrame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message || "DB Service error" });
      }
      const savedItem = await response.json();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const getRes = await fetch(`${dbServiceUrl}/db/pictureFrame/${req.params.id}`);
      if (getRes.status === 404) {
        return res.status(404).json({ message: "Not found" });
      }
      if (!getRes.ok) {
        return res.status(getRes.status).json({ message: "DB Service error" });
      }
      const currentItem = await getRes.json();
      const mergedData = { ...currentItem };
      const fields = ["serial", "brand", "model", "date", "price", "description", "is_new"];
      for (const fieldName of fields) {
        if (req.body[fieldName] !== undefined) {
          if (fieldName === "price") {
            mergedData[fieldName] = Number(req.body[fieldName]);
          } else if (fieldName === "is_new") {
            mergedData[fieldName] = req.body[fieldName] === true || req.body[fieldName] === "true";
          } else {
            mergedData[fieldName] = req.body[fieldName];
          }
        }
      }
      this.validate(mergedData);
      this.calculateScore(mergedData);
      const response = await fetch(`${dbServiceUrl}/db/pictureFrame/${req.params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message || "DB Service error" });
      }
      const updatedItem = await response.json();
      res.json(updatedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const response = await fetch(`${dbServiceUrl}/db/pictureFrame/${req.params.id}`, {
        method: "DELETE"
      });
      if (response.status === 404) {
        return res.status(404).json({ message: "Not found" });
      }
      if (!response.ok) {
        return res.status(response.status).json({ message: "DB Service error" });
      }
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PictureFrameController();
